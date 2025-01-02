const express = require('express');
const router = express.Router();
const { fetchPropertyRecords } = require('../services/propertyRecords');

router.get('/records', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const records = await fetchPropertyRecords(address);
    res.json({ records });
  } catch (error) {
    console.error('Error fetching property records:', error);
    res.status(500).json({ error: 'Failed to fetch property records' });
  }
});

module.exports = { propertyRouter: router }; 