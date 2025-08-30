import { getAuth } from 'firebase-admin/auth';
import express from 'express';
import { db } from '../services/firebase.js'; // Import db instance

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName,
    });

    // Set custom user claims for role (default to 'user' if not provided)
    const userRole = role || 'user';
    await getAuth().setCustomUserClaims(userRecord.uid, { role: userRole });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName: displayName || null,
      role: userRole,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    });

    res.status(201).json({ message: 'User created successfully!', uid: userRecord.uid, role: userRole });

  } catch (error) {
    console.error('Error during signup:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // In a real application, the client-side Firebase SDK handles login,
    // and then sends the ID token to the backend for verification.
    // The backend middleware (in server.js) already verifies this token.
    // This endpoint can be used for basic checks or if you implement custom token generation.
    const userRecord = await getAuth().getUserByEmail(email);

    // For simplicity, we'll just return a success message.
    res.status(200).json({ message: 'Login successful', uid: userRecord.uid });

  } catch (error) {
    console.error('Error during login:', error);
    if (error.code === 'auth/user-not-found') { // Removed wrong-password as we don't verify password here
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// New endpoint to update user role
router.post('/update-role', async (req, res) => {
  try {
    const { role } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let uid;
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch (error) {
      console.error('Error verifying ID token in update-role:', error);
      return res.status(403).json({ message: 'Unauthorized: Invalid token.' });
    }

    console.log(`Attempting to update role for UID: ${uid} to role: ${role}`);

    if (!uid || !role) {
      console.error('Missing UID or role for update-role request.');
      return res.status(400).json({ message: 'User ID and role are required.' });
    }

    // Update custom claims in Firebase Auth
    await getAuth().setCustomUserClaims(uid, { role });
    console.log(`Firebase Auth custom claims updated for UID: ${uid}`);

    // Update user document in Firestore
    await db.collection('users').doc(uid).set({ role }, { merge: true });
    console.log(`Firestore user document updated for UID: ${uid}`);

    res.status(200).json({ message: 'User role updated successfully!', uid, role });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Failed to update user role.', error: error.message });
  }
});

export default router;

  
