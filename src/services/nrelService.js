import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const NREL_API_KEY = import.meta.env.VITE_NREL_API_KEY

/**
 * Fetches EV charging stations within a bounding box
 * @param {Object} bounds - Leaflet LatLngBounds object
 * @returns {Promise<Object>} GeoJSON FeatureCollection of charging stations
 */
export const fetchChargingStations = async (bounds) => {
  try {
    const response = await axios.get(`${API_URL}/api/nrel/stations`, {
      params: {
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
        minLng: bounds.minLng,
        maxLng: bounds.maxLng
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching charging stations:', error)
    return []
  }
}

/**
 * Fetches EV charging station statistics for a state
 */
export const fetchChargingStats = async (state) => {
  try {
    const response = await axios.get(`${NREL_API_BASE_URL}/stats.json`, {
      params: {
        api_key: process.env.VITE_NREL_API_KEY,
        fuel_type: 'ELEC',
        state: state
      }
    })

    return {
      totalStations: response.data.total_results,
      totalPorts: response.data.total_ports,
      stationTypes: response.data.station_types,
      portTypes: response.data.port_types
    }
  } catch (error) {
    console.error('Error fetching charging stats:', error)
    throw error
  }
} 