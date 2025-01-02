import axios from 'axios';

const MOCK_PROPERTIES = [
  {
    id: 1,
    address: '123 Main St',
    city: 'Springfield',
    state: 'MA',
    price: 350000,
    lat: 42.1015,
    lng: -72.5898,
    propertyType: 'Single Family',
    yearBuilt: 1985,
    squareFeet: 2000,
    lotSize: 0.25
  }
  // Add more mock properties as needed
];

export async function fetchPropertyListings(bbox) {
  try {
    // First try MassGIS API
    const massGisResponse = await axios.get(`/api/gis/parcels`, {
      params: {
        bbox: bbox.join(',')
      }
    });
    
    if (massGisResponse.data && massGisResponse.data.features) {
      return massGisResponse.data.features.map(feature => ({
        id: feature.properties.PARCEL_ID,
        address: feature.properties.ADDRESS,
        city: feature.properties.CITY,
        state: 'MA',
        price: feature.properties.TOTAL_VALUE,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        propertyType: feature.properties.USE_CODE_DESC,
        yearBuilt: feature.properties.YEAR_BUILT,
        squareFeet: feature.properties.LIVING_AREA,
        lotSize: feature.properties.LOT_SIZE
      }));
    }
  } catch (error) {
    console.warn('MassGIS API not available:', error);
  }

  try {
    // Then try county records API
    const countyResponse = await axios.get(`/api/property/records`, {
      params: {
        bbox: bbox.join(',')
      }
    });
    
    if (countyResponse.data && Array.isArray(countyResponse.data)) {
      return countyResponse.data;
    }
  } catch (error) {
    console.warn('County records API not available:', error);
  }

  // Finally, fall back to mock data
  console.info('Using mock property data');
  return MOCK_PROPERTIES.filter(property => 
    property.lat >= bbox[0] && 
    property.lat <= bbox[2] && 
    property.lng >= bbox[1] && 
    property.lng <= bbox[3]
  );
} 