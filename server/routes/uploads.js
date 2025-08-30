import express from 'express';
import { bucket } from '../services/firebase.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const file = req.file;
    const fileName = `images/${uuidv4()}-${file.originalname}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading to Firebase Storage:', err);
      res.status(500).json({ message: 'Failed to upload image.', error: err.message });
    });

    blobStream.on('finish', async () => {
      // Make the image public
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Error in image upload endpoint:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

export default router;