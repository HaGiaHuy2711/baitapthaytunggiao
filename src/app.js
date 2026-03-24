const express = require("express");

const productRoutes = require("./routes/product.route");
const authRoutes = require("./routes/auth.route");

const app = express();

app.use(express.json());

app.use("/products", productRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;