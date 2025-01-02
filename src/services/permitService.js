import axios from 'axios'

// Mock data for testing
const MOCK_PERMITS = [
  {
    id: '1',
    latitude: 42.1035,
    longitude: -72.5888,
    address: '1234 Solar St, Springfield, MA',
    system_size: 7.5,
    install_date: '2023-06-15'
  },
  {
    id: '2',
    latitude: 42.1045,
    longitude: -72.5868,
    address: '5678 Sun Ave, Springfield, MA',
    system_size: 6.2,
    install_date: '2023-07-20'
  }
]

export const fetchSolarPermits = async (bounds) => {
  // Return mock data if no API key
  if (!process.env.VITE_MASS_DATA_API_KEY || process.env.VITE_MASS_DATA_API_KEY.includes('your_')) {
    console.log('Using mock solar permit data')
    return MOCK_PERMITS
  }

  try {
    const response = await axios.get('https://data.mass.gov/resource/8z6e-nysi.json', {
      params: {
        $where: `permit_type like '%SOLAR%'`,
        $limit: 100,
        $$app_token: process.env.VITE_MASS_DATA_API_KEY
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching solar permits:', error)
    return MOCK_PERMITS
  }
} 

// Fetch solar permit data from Mass.gov Building Permits API
export const fetchSolarPermitData = async (bounds) => {
  try {
    const response = await fetch(
      `https://aca.accela.com/MASSGOV/Cap/CapService.asmx/GetPermits`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'SOLAR',
          status: 'ISSUED',
          fromDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Last 90 days
          toDate: new Date().toISOString(),
          bounds: {
            west: bounds.getWest(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            north: bounds.getNorth()
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert to GeoJSON format
    return {
      type: 'FeatureCollection',
      features: data.permits.map(permit => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [permit.longitude, permit.latitude]
        },
        properties: {
          id: permit.permitNumber,
          address: permit.address,
          status: permit.status,
          issueDate: permit.issueDate,
          estimatedCost: permit.valuation,
          description: permit.description,
          contractor: permit.contractor
        }
      }))
    };
  } catch (error) {
    console.error('Error fetching solar permit data:', error);
    throw error;
  }
} 