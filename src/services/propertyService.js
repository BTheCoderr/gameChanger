import axios from 'axios'
import { scrapeZillowListings, scrapeRealtorListings, scrapeHampdenRecords } from './scraperService'

const ATTOM_API_BASE_URL = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0'

// Mock data for testing
const MOCK_PROPERTIES = [
  {
    id: '1',
    latitude: 42.1015,
    longitude: -72.5898,
    address: '1234 Main St, Springfield, MA',
    assessed_value: 350000,
    year_built: 1985,
    additional_data: {
      zillow_price: '$375,000',
      realtor_price: '$372,000',
      last_sale_date: '2021-05-15',
      last_sale_price: '$340,000'
    }
  },
  {
    id: '2',
    latitude: 42.1025,
    longitude: -72.5878,
    address: '5678 Oak Ave, Springfield, MA',
    assessed_value: 425000,
    year_built: 1992,
    additional_data: {
      zillow_price: '$450,000',
      realtor_price: '$445,000',
      last_sale_date: '2020-08-22',
      last_sale_price: '$410,000'
    }
  }
]

export const fetchPropertyData = async (bounds) => {
  // Return mock data if no API key
  if (!process.env.VITE_ATTOM_API_KEY || process.env.VITE_ATTOM_API_KEY.includes('your_')) {
    console.log('Using mock property data')
    return MOCK_PROPERTIES
  }

  try {
    // Fetch official property data
    const response = await axios.get('/property/detail', {
      baseURL: ATTOM_API_BASE_URL,
      headers: {
        'apikey': process.env.VITE_ATTOM_API_KEY,
        'Accept': 'application/json'
      },
      params: {
        latitude: (bounds.minLat + bounds.maxLat) / 2,
        longitude: (bounds.minLng + bounds.maxLng) / 2,
        radius: 3,
        pageSize: 100
      }
    })

    // Try to fetch additional data, but don't fail if scraping fails
    let zillowData = [], realtorData = []
    try {
      [zillowData, realtorData] = await Promise.all([
        scrapeZillowListings(bounds),
        scrapeRealtorListings(bounds)
      ])
    } catch (error) {
      console.log('Scraping failed, continuing with official data only')
    }

    // Combine official and scraped data (if available)
    const enrichedProperties = response.data.property.map(prop => {
      const address = `${prop.address.line1}, ${prop.address.locality}, ${prop.address.countrySubd}`
      const zillowMatch = zillowData.find(z => z.address.includes(prop.address.line1))
      const realtorMatch = realtorData.find(r => r.address.includes(prop.address.line1))

      return {
        id: prop.identifier.obPropId,
        latitude: parseFloat(prop.location.latitude),
        longitude: parseFloat(prop.location.longitude),
        address: address,
        assessed_value: prop.assessment.assessed,
        year_built: prop.summary.yearBuilt,
        additional_data: {
          zillow_price: zillowMatch?.price,
          realtor_price: realtorMatch?.price,
          zillow_details: zillowMatch?.details,
          realtor_details: realtorMatch?.details
        }
      }
    })

    return enrichedProperties
  } catch (error) {
    console.error('Error fetching property data:', error)
    return MOCK_PROPERTIES
  }
}

// Fetch detailed property info including county records
export const fetchPropertyDetails = async (address) => {
  try {
    // Fetch county records
    const countyRecords = await scrapeHampdenRecords(address)
    
    // Return combined data
    return {
      address,
      county_records: countyRecords
    }
  } catch (error) {
    console.error('Error fetching property details:', error)
    return null
  }
} 