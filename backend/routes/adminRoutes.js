const express = require("express");

const router = express.Router();

const {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require(
  "../controllers/adminController"
);

const verifyToken = require(
  "../middleware/authMiddleware"
);

const authorizeRole = require(
  "../middleware/roleMiddleware"
);

/*
|--------------------------------------------------------------------------
| Admin CRUD Routes
|--------------------------------------------------------------------------
*/

// Get All Doctors
router.get(
  "/doctors",
  verifyToken,
  authorizeRole("admin"),
  getDoctors
);

// Create Doctor
router.post(
  "/doctors",
  verifyToken,
  authorizeRole("admin"),
  createDoctor
);

// Update Doctor
router.put(
  "/doctors/:id",
  verifyToken,
  authorizeRole("admin"),
  updateDoctor
);

// Delete Doctor
router.delete(
  "/doctors/:id",
  verifyToken,
  authorizeRole("admin"),
  deleteDoctor
);

module.exports = router;