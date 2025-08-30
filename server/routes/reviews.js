import express from 'express';
import { db } from '../services/firebase.js';

const router = express.Router();

// Get all reviews for a specific business
router.get('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const reviewsRef = db.collection('reviews').where('businessId', '==', businessId);
    const snapshot = await reviewsRef.orderBy('createdAt', 'desc').get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({ message: 'Failed to retrieve reviews', error: error.message });
  }
});

// Submit a new review
router.post('/', async (req, res) => {
  try {
    const { businessId, userId, userName, rating, comment } = req.body;

    if (!businessId || !userId || !userName || rating === undefined || !comment) {
      return res.status(400).json({ message: 'Missing required review fields' });
    }

    // Check if the user has already reviewed this business
    const existingReviewSnapshot = await db.collection('reviews')
      .where('businessId', '==', businessId)
      .where('userId', '==', userId)
      .get();

    if (!existingReviewSnapshot.empty) {
      return res.status(409).json({ message: 'You have already reviewed this business.' });
    }

    const newReview = {
      businessId,
      userId,
      userName,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    const docRef = await db.collection('reviews').add(newReview);

    res.status(201).json({ message: 'Review submitted successfully', reviewId: docRef.id });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
});

export default router;