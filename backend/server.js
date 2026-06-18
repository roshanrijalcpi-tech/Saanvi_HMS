const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

const app = express();

const { connectDB, sequelize } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes =
  require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Saanvi HMS Backend Running");
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/appointments",
  appointmentRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server Running On Port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });