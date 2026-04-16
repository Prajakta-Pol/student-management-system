const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

const authRoutes = require("./routes/authRoutes");
const appRoutes = require("./routes/appRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/app", appRoutes);

module.exports = app;