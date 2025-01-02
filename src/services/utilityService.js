import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const fetchUtilityData = async (bounds) => {
  try {
    const response = await axios.get(`${API_URL}/api/utility/boundaries`, {
      params: {
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
        minLng: bounds.minLng,
        maxLng: bounds.maxLng
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching utility data:', error)
    return {
      type: 'FeatureCollection',
      features: []
    }
  }
} 