const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");

router.get("/reservations", reservationController.getAllReservations);

router.get("/reservations/:id", reservationController.getReservationById);

router.post("/reserveACart", reservationController.reserveACart);

router.post("/reserveItems", reservationController.reserveItems);

router.post("/cancelReserve/:id", reservationController.cancelReserve);

module.exports = router;