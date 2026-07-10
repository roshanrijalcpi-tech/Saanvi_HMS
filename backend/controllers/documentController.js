const User = require('../models/User');
const path = require('path');

// Upload PDF
exports.uploadDocument = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const newDocument = {
      filename: req.file.originalname,
      filepath: req.file.path,
      uploadedAt: new Date()
    };

    user.documents = user.documents ? [...user.documents, newDocument] : [newDocument];
    await user.save();

    res.json({
      success: true,
      message: "PDF uploaded successfully",
      document: newDocument
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download PDF
exports.downloadDocument = (req, res) => {
  const filePath = path.join(__dirname, '../uploads/documents', req.params.filename);
  
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: "File not found" });
    }
  });
};