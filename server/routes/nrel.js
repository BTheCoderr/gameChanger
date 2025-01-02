const express = require('express');
const axios = require('axios');
const router = express.Router();

const NREL_API_KEY = process.env.VITE_NREL_API_KEY;

// Utility function for logging
const logApiCall = (endpoint, params) => {
  console.log(`⚡ NREL API Call to ${endpoint}`, { params });
};

// Get EV charging stations
router.get('/stations', async (req, res) => {
  const { west, south, east, north } = req.query;
  console.log(`🌐 Received request for EV stations: bbox=${west},${south},${east},${north}`);
  
  try {
    logApiCall('alt-fuel-stations/v1.json', { bbox: `${west},${south},${east},${north}` });
    
    const response = await axios.get(
      'https://developer.nrel.gov/api/alt-fuel-stations/v1.json',
      {
        params: {
          api_key: NREL_API_KEY,
          fuel_type: 'ELEC',
          status: 'E',  // Open stations
          access: 'public',
          bbox: `${west},${south},${east},${north}`
        }
      }
    );

    console.log(`✅ NREL API responded with ${response.data.fuel_stations?.length || 0} stations`);

    // Add some useful derived data
    const stations = (response.data.fuel_stations || []).map(station => ({
      ...station,
      isLevel2: station.ev_level2_evse_num > 0,
      isFastCharger: station.ev_dc_fast_num > 0,
      totalPorts: (station.ev_level2_evse_num || 0) + (station.ev_dc_fast_num || 0)
    }));

    console.log('✅ Station types:', {
      level2: stations.filter(s => s.isLevel2).length,
      fastCharger: stations.filter(s => s.isFastCharger).length
    });

    res.json({ stations });
  } catch (error) {
    console.error('❌ NREL API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch EV stations',
      details: error.response?.data || error.message
    });
  }
});

module.exports = { nrelRouter: router }; 