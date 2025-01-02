const express = require('express');
const axios = require('axios');
const router = express.Router();

const CENSUS_API_KEY = process.env.VITE_CENSUS_API_KEY;
const CENSUS_BASE_URL = 'https://api.census.gov/data/2021/acs/acs5';

// Utility function for logging
const logApiCall = (endpoint, params) => {
  console.log(`📊 Census API Call to ${endpoint}`, { params });
};

// Get language data
router.get('/language/:state/:county', async (req, res) => {
  const { state, county } = req.params;
  console.log(`🌐 Received request for language data: state=${state}, county=${county}`);
  
  try {
    logApiCall(CENSUS_BASE_URL, { state, county });
    
    const response = await axios.get(CENSUS_BASE_URL, {
      params: {
        get: [
          'B16001_001E', // Total population 5 years and over
          'B16001_005E', // Spanish or Spanish Creole speakers
          'B19013_001E', // Median household income
          'B25077_001E', // Median home value
          'NAME',
          'tract'
        ].join(','),
        for: 'tract:*',
        in: `state:${state} county:${county}`,
        key: CENSUS_API_KEY
      }
    });

    console.log(`✅ Census API responded with ${response.data.length} rows`);

    // Transform into GeoJSON format
    const features = response.data.slice(1).map(row => ({
      type: 'Feature',
      properties: {
        totalPop: parseInt(row[0]),
        spanishSpeakers: parseInt(row[1]),
        medianIncome: parseInt(row[2]),
        medianHomeValue: parseInt(row[3]),
        name: row[4],
        tract: row[5],
        percentage: (parseInt(row[1]) / parseInt(row[0]) * 100).toFixed(1)
      },
      geometry: {
        type: 'Polygon',
        coordinates: [] // Will be filled by Tiger/Line data
      }
    }));

    console.log(`✅ Transformed ${features.length} features`);

    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (error) {
    console.error('❌ Census API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch language data',
      details: error.response?.data || error.message
    });
  }
});

// Get income data for EV ownership proxy
router.get('/income/:state', async (req, res) => {
  const { state } = req.params;
  console.log(`🌐 Received request for income data: state=${state}`);
  
  try {
    logApiCall(CENSUS_BASE_URL, { state });
    
    const response = await axios.get(CENSUS_BASE_URL, {
      params: {
        get: ['B19013_001E', 'NAME', 'tract'].join(','),
        for: 'tract:*',
        in: `state:${state}`,
        key: CENSUS_API_KEY
      }
    });

    console.log(`✅ Census API responded with ${response.data.length} rows`);

    const highIncomeAreas = response.data.slice(1)
      .filter(row => parseInt(row[0]) > 100000)
      .map(row => ({
        tract: row[2],
        name: row[1],
        income: parseInt(row[0])
      }));

    console.log(`✅ Found ${highIncomeAreas.length} high-income areas`);

    res.json({ highIncomeAreas });
  } catch (error) {
    console.error('❌ Census API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch income data',
      details: error.response?.data || error.message
    });
  }
});

// Get neighborhood insights
router.get('/neighborhood/:state/:county', async (req, res) => {
  const { state, county } = req.params;
  console.log(`🌐 Received request for neighborhood data: state=${state}, county=${county}`);
  
  try {
    logApiCall(CENSUS_BASE_URL, { state, county });
    
    const response = await axios.get(CENSUS_BASE_URL, {
      params: {
        get: [
          'B19013_001E',  // Median household income
          'B01003_001E',  // Total population
          'B25077_001E',  // Median home value
          'NAME'
        ].join(','),
        for: 'tract:*',
        in: `state:${state} county:${county}`,
        key: CENSUS_API_KEY
      }
    });

    console.log(`✅ Census API responded with ${response.data.length} rows`);

    const features = response.data.slice(1).map(row => ({
      type: 'Feature',
      properties: {
        medianIncome: parseInt(row[0]),
        population: parseInt(row[1]),
        medianHomeValue: parseInt(row[2]),
        name: row[3],
        insightScore: (parseInt(row[0]) / 100000 + parseInt(row[2]) / 1000000) / 2
      },
      geometry: {
        type: 'Polygon',
        coordinates: [] // Will be filled by Tiger/Line data
      }
    }));

    console.log(`✅ Transformed ${features.length} features`);

    res.json({
      type: 'FeatureCollection',
      features
    });
  } catch (error) {
    console.error('❌ Census API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch neighborhood data',
      details: error.response?.data || error.message
    });
  }
});

module.exports = { censusRouter: router }; 