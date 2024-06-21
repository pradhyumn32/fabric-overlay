const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.fields([{ name: 'dress' }, { name: 'fabric' }]), async (req, res) => {
  try {
    if (!req.files || !req.files.dress || !req.files.fabric) {
      console.error('No files uploaded');
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const dressPath = req.files.dress[0].path;
    const fabricPath = req.files.fabric[0].path;

    // Process images with sharp to overlay fabric on dress
    const outputImagePath = `uploads/processed-${Date.now()}.png`;

    // Get the dimensions of the dress image
    const dressMetadata = await sharp(dressPath).metadata();
    const { width, height } = dressMetadata;

    // Resize the fabric image to match the dimensions of the dress image
    const fabricResized = await sharp(fabricPath).resize(width, height).toBuffer();

    await sharp(dressPath)
      .composite([{ input: fabricResized, blend: 'multiply' }])
      .toFile(outputImagePath);

    res.json({ dress_path: dressPath, fabric_path: fabricPath, output_path: outputImagePath });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
