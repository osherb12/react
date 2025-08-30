import express from 'express';
import { db } from '../services/firebase.js';

const router = express.Router();

// Get all businesses
router.get('/', async (req, res) => {
  try {
    const { ownerId, mainCategoryId, subCategoryId, keyword } = req.query;
    let businessesRef = db.collection('businesses');
    let query = businessesRef;

    if (ownerId) {
      query = query.where('ownerId', '==', ownerId);
    }

    if (mainCategoryId) {
      query = query.where('mainCategoryId', '==', mainCategoryId);
    }

    if (subCategoryId) {
      query = query.where('subCategoryId', '==', subCategoryId);
    }

    let snapshot = await query.get();
    let businesses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Manual keyword filtering for now, as Firestore doesn't support full-text search directly
    if (keyword) {
      const lowerCaseKeyword = keyword.toLowerCase();
      businesses = businesses.filter(business =>
        business.name.toLowerCase().includes(lowerCaseKeyword) ||
        business.description.toLowerCase().includes(lowerCaseKeyword) ||
        business.mainCategoryName.toLowerCase().includes(lowerCaseKeyword) ||
        (business.subCategoryName && business.subCategoryName.toLowerCase().includes(lowerCaseKeyword))
      );
    }

    res.status(200).json(businesses);
  } catch (error) {
    console.error('Error getting businesses:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to retrieve businesses', error: error.message });
    // Possible causes for 500 errors:
    // 1. Missing Firestore indexes for queries with multiple 'where' clauses.
    //    Check your Firestore console -> 'Indexes' for suggested indexes.
    // 2. Firestore security rules preventing read access.
    //    Check your Firestore console -> 'Rules' to ensure read permissions are granted.
  }
});

// Get a single business by ID
router.get('/:id', async (req, res) => {
  try {
    const businessId = req.params.id;
    const businessRef = db.collection('businesses').doc(businessId);
    const doc = await businessRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting business:', error);
    res.status(500).json({ message: 'Failed to retrieve business', error: error.message });
  }
});

// Create a new business
router.post('/', async (req, res) => {
  try {
    const { name, description, mainCategoryId, subCategoryId, mainCategoryName, subCategoryName, address, contact, ownerId, ownerName, images, hoursOfOperation, yearsOfExperience, profileImageUrl } = req.body;

    if (!name || !ownerId || !ownerName || !mainCategoryId) {
      return res.status(400).json({ message: 'Business name, ownerId, ownerName, and mainCategoryId are required' });
    }

    const newBusiness = {
      name,
      description: description || '',
      mainCategoryId,
      subCategoryId: subCategoryId || null,
      mainCategoryName: mainCategoryName || '',
      subCategoryName: subCategoryName || null,
      address: address || {},
      contact: contact || {},
      ownerId,
      ownerName,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      images: images || [],
      hoursOfOperation: hoursOfOperation || {},
      yearsOfExperience: yearsOfExperience || '',
      profileImageUrl: profileImageUrl || null,
    };

    const docRef = await db.collection('businesses').add(newBusiness);

    res.status(201).json({ message: 'Business created successfully', businessId: docRef.id, ...newBusiness, id: docRef.id });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ message: 'Failed to create business', error: error.message });
  }
});

// Update a business
router.put('/:id', async (req, res) => {
  try {
    const businessId = req.params.id;
    const updates = req.body;

    const businessRef = db.collection('businesses').doc(businessId);
    await businessRef.update({
      ...updates,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: 'Business updated successfully', businessId });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ message: 'Failed to update business', error: error.message });
  }
});

// Delete a business
router.delete('/:id', async (req, res) => {
  try {
    const businessId = req.params.id;
    const businessRef = db.collection('businesses').doc(businessId);
    await businessRef.delete();

    res.status(200).json({ message: 'Business deleted successfully', businessId });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ message: 'Failed to delete business', error: error.message });
  }
});

export default router;
