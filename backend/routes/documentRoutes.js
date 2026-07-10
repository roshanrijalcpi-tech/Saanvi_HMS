const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  }
});

// Upload PDF
router.post('/upload/:userId', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
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
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Download PDF
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/documents', req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ success: false, message: "File not found" });
    }
  });
});

module.exports = router;