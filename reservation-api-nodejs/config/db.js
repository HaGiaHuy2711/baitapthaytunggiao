const sql = require("mssql");

const config = {
  user: "nodeuser",
  password: "123456",
  server: "localhost",
  database: "reservation_db",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch(err => console.log("Database Connection Failed!", err));

module.exports = { sql, poolPromise };