import './config.js';
import express from 'express';
import cors from 'cors';

import { getAuth } from 'firebase-admin/auth';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import businessesRouter from './routes/businesses.js';
import categoriesRouter from './routes/categories.js';
import reviewsRouter from './routes/reviews.js';
import uploadsRouter from './routes/uploads.js';
import israelDataRouter from './routes/israelData.js';

const app = express();
const port = process.env.PORT || 3001;



// CORS middleware
app.use(cors());

// JSON body parser
app.use(express.json());

// Add a logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middleware to verify Firebase ID token and attach user to req
app.use(async (req, res, next) => {
  // Skip token verification for auth routes and OPTIONS requests
  if (req.path.startsWith('/api/auth') || req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      req.user = decodedToken; // Attach decoded token to req.user
      next();
    } catch (error) {
      console.error('Error verifying Firebase ID token:', error);
      return res.status(403).json({ message: 'Unauthorized: Invalid token.' });
    }
  } else {
    // For routes that don't require authentication, proceed without a user
    next();
  }
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/businesses', businessesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/israel-data', israelDataRouter);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});