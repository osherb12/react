import express from 'express';
import { db } from '../services/firebase.js';

const router = express.Router();

// Get all users (for admin purposes, or limited public view)
router.get('/', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Failed to retrieve user', error: error.message });
  }
});

// Create a new user (typically handled by Firebase Auth, but can be used for adding profile data)
router.post('/', async (req, res) => {
  try {
    const { id, email, displayName, role } = req.body;

    if (!id || !email) {
      return res.status(400).json({ message: 'User ID and email are required' });
    }

    const userRef = db.collection('users').doc(id);
    await userRef.set({
      email,
      displayName: displayName || null,
      role: role || 'user',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }, { merge: true }); // Use merge to avoid overwriting if doc exists from auth

    res.status(201).json({ message: 'User created/updated successfully', userId: id });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Failed to create/update user', error: error.message });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const userRef = db.collection('users').doc(userId);
    await userRef.update(updates);

    res.status(200).json({ message: 'User updated successfully', userId });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection('users').doc(userId);
    await userRef.delete();

    res.status(200).json({ message: 'User deleted successfully', userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

export default router;