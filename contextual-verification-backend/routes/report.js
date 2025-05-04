// routes/report.js
const express = require('express');
const PDFDocument = require('pdfkit');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate', authMiddleware, (req, res) => {
  // Assuming analysis details (except full page content) are sent in the request body
  const {
    url,
    metaTitle,
    metaKeywords,
    metaDescription,
    scores,
    missingWords
  } = req.body;

  // Create a PDF document
  const doc = new PDFDocument();
  
  // Set response headers to indicate a PDF file
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  
  // Pipe the document to the response
  doc.pipe(res);

  // Add content to PDF
  doc.fontSize(18).text("Webpage Analysis Report", { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`URL: ${url}`);
  doc.text(`Meta Title: ${metaTitle}`);
  doc.text(`Meta Keywords: ${metaKeywords}`);
  doc.text(`Meta Description: ${metaDescription}`);
  doc.moveDown();

  doc.fontSize(14).text("Scores:", { underline: true });
  for (const [key, value] of Object.entries(scores)) {
    doc.fontSize(12).text(`${key}: ${value}`);
  }
  doc.moveDown();

  doc.fontSize(14).text("Missing Words:", { underline: true });
  for (const [key, value] of Object.entries(missingWords)) {
    doc.fontSize(12).text(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
  }
  doc.end();
});

module.exports = router;