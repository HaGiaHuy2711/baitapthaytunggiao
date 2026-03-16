const { sql, poolPromise } = require("../config/db");

// GET /reservations
exports.getAllReservations = async (req, res) => {
  try {

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("user_id", sql.Int, 1)
      .query("SELECT * FROM reservations WHERE user_id = @user_id");

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(err.message);
  }
};


// GET /reservations/:id
exports.getReservationById = async (req, res) => {
  try {

    const pool = await poolPromise;
    const id = req.params.id;

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT r.*, ri.product_id, ri.quantity
        FROM reservations r
        LEFT JOIN reservation_items ri
        ON r.id = ri.reservation_id
        WHERE r.id = @id
      `);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(err.message);
  }
};


// POST /reserveItems
exports.reserveItems = async (req, res) => {

  const { items } = req.body;

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {

    await transaction.begin();

    // tạo reservation
    const reservationResult = await new sql.Request(transaction)
      .query(`
        INSERT INTO reservations (user_id, status)
        OUTPUT INSERTED.id
        VALUES (1, 'ACTIVE')
      `);

    const reservationId = reservationResult.recordset[0].id;

    // loop items
    for (const item of items) {

      const { product_id, quantity } = item;

      const product = await new sql.Request(transaction)
        .input("product_id", sql.Int, product_id)
        .query("SELECT stock FROM products WHERE id = @product_id");

      if (product.recordset.length === 0) {
        throw new Error("Product not found");
      }

      const stock = product.recordset[0].stock;

      if (stock < quantity) {
        throw new Error("Not enough stock");
      }

      // insert reservation_items
      await new sql.Request(transaction)
        .input("reservation_id", sql.Int, reservationId)
        .input("product_id", sql.Int, product_id)
        .input("quantity", sql.Int, quantity)
        .query(`
          INSERT INTO reservation_items (reservation_id, product_id, quantity)
          VALUES (@reservation_id, @product_id, @quantity)
        `);

      // trừ stock
      await new sql.Request(transaction)
        .input("product_id", sql.Int, product_id)
        .input("quantity", sql.Int, quantity)
        .query(`
          UPDATE products
          SET stock = stock - @quantity
          WHERE id = @product_id
        `);
    }

    await transaction.commit();

    res.json({
      message: "reserveItems success",
      reservationId
    });

  } catch (err) {

    await transaction.rollback();

    res.status(500).json({
      error: err.message
    });

  }

};


// POST /reserveACart
exports.reserveACart = async (req, res) => {

  try {

    const pool = await poolPromise;

    const result = await pool
      .request()
      .query(`
        INSERT INTO reservations (user_id, status)
        OUTPUT INSERTED.id
        VALUES (1, 'ACTIVE')
      `);

    res.json({
      message: "reserveACart success",
      reservationId: result.recordset[0].id
    });

  } catch (err) {
    res.status(500).send(err.message);
  }

};


// POST /cancelReserve/:id
exports.cancelReserve = async (req, res) => {

  const id = req.params.id;

  try {

    const pool = await poolPromise;

    const items = await pool
      .request()
      .input("reservation_id", sql.Int, id)
      .query(`
        SELECT product_id, quantity
        FROM reservation_items
        WHERE reservation_id = @reservation_id
      `);

    // trả lại stock
    for (const item of items.recordset) {

      await pool
        .request()
        .input("product_id", sql.Int, item.product_id)
        .input("quantity", sql.Int, item.quantity)
        .query(`
          UPDATE products
          SET stock = stock + @quantity
          WHERE id = @product_id
        `);
    }

    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE reservations
        SET status = 'CANCELLED'
        WHERE id = @id
      `);

    res.json({
      message: "Reservation cancelled"
    });

  } catch (err) {
    res.status(500).send(err.message);
  }

};