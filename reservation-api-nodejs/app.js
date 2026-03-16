const express = require("express");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

app.use(express.json());

app.use("/", reservationRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});