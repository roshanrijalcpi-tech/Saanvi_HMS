const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Welcome Email
exports.sendWelcomeEmail = async (email, fullname) => {
  await transporter.sendMail({
    from: `"Saanvi HMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Saanvi HMS!",
    html: `
      <h2>Welcome ${fullname}!</h2>
      <p>Thank you for registering with Saanvi Hospital Management System.</p>
      <p>You can now book appointments and manage your health records.</p>
    `
  });
};

// Appointment Booking - To Patient
exports.sendAppointmentConfirmationToPatient = async (patientEmail, doctorName, date) => {
  await transporter.sendMail({
    from: `"Saanvi HMS" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: "Appointment Booked Successfully",
    html: `
      <h3>Your Appointment is Booked</h3>
      <p>Doctor: <strong>${doctorName}</strong></p>
      <p>Date: <strong>${date}</strong></p>
      <p>Status: <strong>Pending Approval</strong></p>
    `
  });
};

// Appointment Booking - To Doctor
exports.sendAppointmentNotificationToDoctor = async (doctorEmail, patientName, date) => {
  await transporter.sendMail({
    from: `"Saanvi HMS" <${process.env.EMAIL_USER}>`,
    to: doctorEmail,
    subject: "New Appointment Request",
    html: `
      <h3>New Appointment Request</h3>
      <p>Patient: <strong>${patientName}</strong></p>
      <p>Date: <strong>${date}</strong></p>
      <p>Please review and approve/reject.</p>
    `
  });
};

// Appointment Status Update - To Patient
exports.sendAppointmentStatusToPatient = async (patientEmail, doctorName, date, status) => {
  await transporter.sendMail({
    from: `"Saanvi HMS" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: `Appointment ${status}`,
    html: `
      <h3>Appointment ${status}</h3>
      <p>Doctor: <strong>${doctorName}</strong></p>
      <p>Date: <strong>${date}</strong></p>
      <p>Your appointment has been <strong>${status}</strong>.</p>
    `
  });
};

// Forgot Password
exports.sendResetPasswordEmail = async (email, resetLink) => {
  await transporter.sendMail({
    from: `"Saanvi HMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `
  });
};

module.exports = exports;