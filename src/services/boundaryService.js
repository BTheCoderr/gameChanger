import axios from 'axios'

const TIGER_API_BASE_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb'

export const fetchCityBoundaries = async (state = '25', county = '013') => {
  try {
    const response = await axios.get(`${TIGER_API_BASE_URL}/Places_CouSub/MapServer/8/query`, {
      params: {
        where: `STATE='${state}' AND COUNTY='${county}'`,
        outFields: 'NAME,GEOID,ALAND,AWATER',
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects',
        outSR: 4326,
        f: 'geojson'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching city boundaries:', error)
    throw error
  }
}

export const fetchNeighborhoodBoundaries = async (state = '25', county = '013') => {
  try {
    const response = await axios.get(`${TIGER_API_BASE_URL}/Tracts_Blocks/MapServer/14/query`, {
      params: {
        where: `STATE='${state}' AND COUNTY='${county}'`,
        outFields: 'TRACT,NAME,GEOID,ALAND,AWATER',
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects',
        outSR: 4326,
        f: 'geojson'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error fetching neighborhood boundaries:', error)
    throw error
  }
} 