const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "doctor", "patient"),
    allowNull: false,
    defaultValue: "patient",
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documents: {                    // ← NEW FIELD for PDF
    type: DataTypes.JSON,
    defaultValue: []              // [{ filename, filepath, uploadedAt }]
  }
}, {
  timestamps: true
});

module.exports = User;