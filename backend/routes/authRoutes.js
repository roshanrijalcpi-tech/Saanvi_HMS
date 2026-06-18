const express = require("express");

const {
  register,
  login,
  getDoctors,
  getAllUsers,
} = require("../controllers/authController");

const verifyToken = require(
  "../middleware/authMiddleware"
);

const authorizeRole = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Get all doctors
router.get(
  "/doctors",
  verifyToken,
  getDoctors
);

// Admin Only
router.get(
  "/users",
  verifyToken,
  authorizeRole("admin"),
  getAllUsers
);

module.exports = router;