const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    'https://game-changer-map.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Google Maps API proxy
app.get('/api/maps/js', async (req, res) => {
  try {
    const params = new URLSearchParams(req.query);
    params.set('key', process.env.GOOGLE_MAPS_API_KEY); // Use backend API key
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/js?${params.toString()}`);
    res.set('Content-Type', 'application/javascript');
    res.send(response.data);
  } catch (error) {
    console.error('Error proxying Google Maps API:', error);
    res.status(500).send('Error loading Google Maps');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// NREL API endpoint
app.get('/api/nrel/stations', async (req, res) => {
  try {
    const { minLat, maxLat, minLng, maxLng } = req.query;
    const response = await axios.get('https://developer.nrel.gov/api/alt-fuel-stations/v1.json', {
      params: {
        api_key: process.env.NREL_API_KEY,
        fuel_type: 'ELEC',
        status: 'E',
        access: 'public',
        bounded_by: `${minLat},${minLng},${maxLat},${maxLng}`,
        limit: 100
      }
    });
    
    res.json(response.data.fuel_stations);
  } catch (error) {
    console.error('Error fetching NREL data:', error);
    res.status(500).json({ error: 'Failed to fetch charging stations' });
  }
});

// Utility boundaries endpoint
app.get('/api/utility/boundaries', async (req, res) => {
  try {
    const { minLat, maxLat, minLng, maxLng } = req.query;
    
    // Validate input parameters
    if (!minLat || !maxLat || !minLng || !maxLng) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['minLat', 'maxLat', 'minLng', 'maxLng']
      });
    }

    const bbox = {
      xmin: parseFloat(minLng),
      ymin: parseFloat(minLat),
      xmax: parseFloat(maxLng),
      ymax: parseFloat(maxLat),
      spatialReference: { wkid: 4326 }
    };

    try {
      const response = await axios.post(
        'https://maps.env.mass.gov/arcgisserver/rest/services/energy/utilities/MapServer/0/query',
        new URLSearchParams({
          f: 'geojson',
          geometry: JSON.stringify(bbox),
          geometryType: 'esriGeometryEnvelope',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: '*',
          returnGeometry: true
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 5000 // Reduced timeout to 5 seconds
        }
      );

      if (!response.data || !response.data.features) {
        console.warn('No utility boundaries found for bbox:', bbox);
        return res.json({
          type: 'FeatureCollection',
          features: []
        });
      }

      res.json(response.data);
    } catch (axiosError) {
      // Handle connection errors gracefully
      console.warn('Mass.gov maps service unavailable, using fallback data');
      return res.json({
        type: 'FeatureCollection',
        features: []
      });
    }
  } catch (error) {
    console.error('Error in utility boundaries endpoint:', error.message);
    res.json({ 
      type: 'FeatureCollection',
      features: []
    });
  }
});

// Census API endpoints
app.get('/api/census/fips', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const response = await axios.get(
      `https://geocoding.geo.census.gov/geocoder/geographies/coordinates`,
      {
        params: {
          x: longitude,
          y: latitude,
          benchmark: 'Public_AR_Current',
          vintage: 'Current_Current',
          layers: 'all',
          format: 'json'
        }
      }
    );

    const result = response.data.result;
    if (!result || !result.geographies) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const fips = {
      state: result.geographies.States[0].GEOID,
      county: result.geographies.Counties[0].GEOID
    };

    res.json(fips);
  } catch (error) {
    console.error('Error getting FIPS codes:', error);
    res.status(500).json({ error: 'Failed to get FIPS codes' });
  }
});

app.get('/api/census/demographics', async (req, res) => {
  try {
    const { state, county } = req.query;
    
    // Validate input parameters
    if (!state || !county) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['state', 'county']
      });
    }

    const response = await axios.get(
      'https://api.census.gov/data/2020/acs/acs5',
      {
        params: {
          get: 'B16001_001E,B16001_004E', // Total population and Spanish speakers
          for: `county:${county}`,
          in: `state:${state}`,
          key: process.env.CENSUS_API_KEY
        }
      }
    );

    // Check if response data is in expected format
    if (!Array.isArray(response.data) || response.data.length < 2) {
      console.warn('Invalid Census API response format, using fallback data');
      return res.json({
        spanishSpeakers: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {
              totalPopulation: 0,
              spanishSpeakers: 0
            }
          }]
        }
      });
    }

    const [headers, data] = response.data;
    const totalPopIndex = headers.indexOf('B16001_001E');
    const spanishIndex = headers.indexOf('B16001_004E');

    // Validate indices
    if (totalPopIndex === -1 || spanishIndex === -1) {
      console.warn('Census API response missing required fields, using fallback data');
      return res.json({
        spanishSpeakers: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {
              totalPopulation: 0,
              spanishSpeakers: 0
            }
          }]
        }
      });
    }

    const result = {
      spanishSpeakers: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {
            totalPopulation: parseInt(data[totalPopIndex]) || 0,
            spanishSpeakers: parseInt(data[spanishIndex]) || 0
          }
        }]
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching Census data:', error);
    // Return empty data structure on error
    res.json({
      spanishSpeakers: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {
            totalPopulation: 0,
            spanishSpeakers: 0
          }
        }]
      }
    });
  }
});

// Root endpoint with HTML response
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>GameChanger Backend</title>
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background-color: #1a1a1a;
            color: #ffffff;
          }
          .status {
            padding: 20px;
            background-color: #2d2d2d;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #3d3d3d;
          }
          .endpoints {
            background-color: #2d2d2d;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #3d3d3d;
          }
          .method {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            margin-right: 8px;
          }
          .get { background-color: #4CAF50; }
          .post { background-color: #2196F3; }
          h1 { margin-top: 0; }
          a { color: #64B5F6; }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="status">
          <h1>🟢 Backend Server is Running</h1>
          <p>Server is up and running on port ${process.env.PORT || 3000}</p>
        </div>
        <div class="endpoints">
          <h2>Available Endpoints:</h2>
          <ul>
            <li><span class="method get">GET</span>/api/census - Census data endpoints</li>
            <li><span class="method get">GET</span>/api/nrel - NREL data endpoints</li>
            <li><span class="method get">GET</span>/api/property - Property data endpoints</li>
            <li><span class="method get">GET</span>/health - Server health check</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

const startServer = async (port) => {
  try {
    await app.listen(port);
    console.log(`Server running on port ${port}`);
    
    // Log environment status
    console.log('Environment variables loaded:');
    console.log('- GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? '✓' : '✗');
    console.log('- NREL_API_KEY:', process.env.NREL_API_KEY ? '✓' : '✗');
    console.log('- CENSUS_API_KEY:', process.env.CENSUS_API_KEY ? '✓' : '✗');
    console.log('- ATTOM_API_KEY:', process.env.ATTOM_API_KEY ? '✓' : '✗');
    
    return true;
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying next port...`);
      return false;
    }
    throw error;
  }
};

const findAvailablePort = async (startPort) => {
  let port = startPort;
  while (port < startPort + 10) {
    if (await startServer(port)) {
      return;
    }
    port++;
  }
  throw new Error('No available ports found');
};

// Start server on first available port
findAvailablePort(process.env.PORT || 3000).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 