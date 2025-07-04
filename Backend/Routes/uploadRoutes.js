const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Setup multer to save uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST route to upload signed PDF
router.post('/upload-signed-pdf', upload.single('file'), (req, res) => {
  try {
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Optionally save metadata to DB here

    res.json({ message: 'Upload successful', file: req.file.filename });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to list all signed PDFs
router.get('/list-signed-pdfs', (req, res) => {
  const directoryPath = path.join(__dirname, '..', 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan files' });
    }
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
    res.json(pdfFiles);
  });
});

// DELETE route to delete a signed PDF by filename
router.delete('/delete-signed-pdf', (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ message: 'Filename is required' });
  }

  // Sanitize filename to avoid path traversal attacks
  const safeFilename = path.basename(filename);
  const filePath = path.join(__dirname, '..', 'uploads', safeFilename);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ message: 'Failed to delete file' });
      }
      res.json({ message: 'File deleted successfully' });
    });
  });
});

module.exports = router;
