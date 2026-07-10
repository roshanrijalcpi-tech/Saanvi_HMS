const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");   // ← Add this

dotenv.config();

const app = express();

const { connectDB, sequelize } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const documentRoutes = require("./routes/documentRoutes");   // ← Add this

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   // ← Add this

connectDB();

app.get("/", (req, res) => {
  res.send("Saanvi HMS Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/documents", documentRoutes);   // ← Add this

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });