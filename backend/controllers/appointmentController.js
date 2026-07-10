const Appointment = require("../models/Appointment");
const emailService = require("../utils/emailService");   // ← Add this

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);

    // Send Email to Patient
    await emailService.sendAppointmentConfirmationToPatient(
      appointment.patientEmail,
      appointment.doctorName,
      appointment.appointmentDate
    );

    // Send Email to Doctor
    // await emailService.sendAppointmentNotificationToDoctor(
    //   doctorEmail, // You need doctor's email
    //   appointment.patientName,
    //   appointment.appointmentDate
    // );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        doctorId: req.params.doctorId,
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    appointment.status = req.body.status;
    await appointment.save();

    // Send Email to Patient on Status Change
    await emailService.sendAppointmentStatusToPatient(
      appointment.patientEmail,
      appointment.doctorName,
      appointment.appointmentDate,
      req.body.status
    );

    res.json({
      message: "Status Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        patientEmail: req.params.email,
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};