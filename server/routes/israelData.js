import express from 'express';
import axios from 'axios';

const router = express.Router();

// Proxy route for fetching Israeli cities
router.get('/cities', async (req, res) => {
  try {
    const response = await axios.get('https://data.gov.il/api/3/action/datastore_search?resource_id=8f714b6f-c35c-4b40-a0e7-547b675eee0e&limit=2000');
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying cities data:', error);
    res.status(500).json({ message: 'Failed to fetch cities data.' });
  }
});

// Proxy route for fetching Israeli streets by city code
router.get('/streets', async (req, res) => {
  const { cityCode } = req.query;
  if (!cityCode) {
    return res.status(400).json({ message: 'City code is required.' });
  }
  try {
    // Note: The resource_id for streets might change or require a different approach.
    // This URL assumes the 'q' parameter can filter by city code.
    const response = await axios.get(`https://data.gov.il/api/3/action/datastore_search?resource_id=a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3&limit=10000&q=${cityCode}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying streets data:', error);
    res.status(500).json({ message: 'Failed to fetch streets data.' });
  }
});

export default router;