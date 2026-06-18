const express = require("express");

const router = express.Router();

const {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateStatus,
} = require(
  "../controllers/appointmentController"
);

const verifyToken = require(
  "../middleware/authMiddleware"
);

const authorizeRole = require(
  "../middleware/roleMiddleware"
);

router.post(
  "/",
  verifyToken,
  authorizeRole("patient"),
  createAppointment
);

router.get(
  "/doctor/:doctorId",
  verifyToken,
  authorizeRole("doctor"),
  getDoctorAppointments
);

router.get(
  "/patient/:email",
  verifyToken,
  authorizeRole("patient"),
  getPatientAppointments
);

router.put(
  "/:id/status",
  verifyToken,
  authorizeRole("doctor"),
  updateStatus
);

module.exports = router;