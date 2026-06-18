const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const appointment =
      await Appointment.create(req.body);

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getDoctorAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.findAll({
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

exports.updateStatus = async (
  req,
  res
) => {
  try {
    const appointment =
      await Appointment.findByPk(
        req.params.id
      );

    appointment.status =
      req.body.status;

    await appointment.save();

    res.json({
      message:
        "Status Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getPatientAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.findAll({
          where: {
            patientEmail:
              req.params.email,
          },
        });

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };