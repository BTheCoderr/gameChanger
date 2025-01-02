import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const CENSUS_API_KEY = import.meta.env.VITE_CENSUS_API_KEY

// Function to convert lat/lng to FIPS codes
const getFipsFromCoords = async (lat, lng) => {
  try {
    const response = await axios.get(`${API_URL}/api/census/fips`, {
      params: { latitude: lat, longitude: lng }
    })
    return response.data
  } catch (error) {
    console.error('Error getting FIPS codes:', error)
    return null
  }
}

export const fetchDemographicData = async (bounds) => {
  try {
    // Get FIPS codes for the center of the viewport
    const centerLat = (bounds.minLat + bounds.maxLat) / 2
    const centerLng = (bounds.minLng + bounds.maxLng) / 2
    const fips = await getFipsFromCoords(centerLat, centerLng)
    
    if (!fips) {
      console.warn('Could not determine location FIPS codes, using mock data')
      return {
        spanishSpeakers: {
          type: 'FeatureCollection',
          features: []
        },
        cityBoundaries: {
          type: 'FeatureCollection',
          features: []
        }
      }
    }

    // Fetch demographic data using FIPS codes
    const response = await axios.get(`${API_URL}/api/census/demographics`, {
      params: {
        state: fips.state,
        county: fips.county
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching Census data:', error)
    // Return empty data structure on error
    return {
      spanishSpeakers: {
        type: 'FeatureCollection',
        features: []
      },
      cityBoundaries: {
        type: 'FeatureCollection',
        features: []
      }
    }
  }
}

/**
 * Fetches language data for multiple counties in a state
 */
export const fetchLanguageData = async (state, counties) => {
  try {
    const response = await axios.get(`${CENSUS_API_BASE_URL}`, {
      params: {
        get: [CENSUS_VARIABLES.TOTAL_POPULATION, CENSUS_VARIABLES.SPANISH_SPEAKERS].join(','),
        for: 'county:*',
        in: `state:${state}`,
        key: process.env.VITE_CENSUS_API_KEY
      }
    })

    const [headers, ...data] = response.data
    
    // Filter for requested counties and convert to GeoJSON
    return {
      type: 'FeatureCollection',
      features: data
        .filter(row => counties.includes(row[headers.indexOf('county')]))
        .map(row => ({
          type: 'Feature',
          properties: {
            totalPopulation: parseInt(row[headers.indexOf(CENSUS_VARIABLES.TOTAL_POPULATION)]),
            spanishSpeakers: parseInt(row[headers.indexOf(CENSUS_VARIABLES.SPANISH_SPEAKERS)]),
            county: row[headers.indexOf('county')]
          }
        }))
    }
  } catch (error) {
    console.error('Error fetching language data:', error)
    throw error
  }
} 