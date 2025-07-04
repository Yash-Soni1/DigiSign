const mongoose = require('mongoose');

const SignedPdfSchema = new mongoose.Schema({
  filename: { type: String, required: true },        // Stored PDF filename on disk
  originalName: { type: String, required: true },    // Original PDF name from user
  signature: { type: String, required: true },       // Signature text
  position: {
    x: Number,
    y: Number
  },
  page: Number,
  signedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SignedPdf', SignedPdfSchema);
