import axios from 'axios'
import cheerio from 'cheerio'

// Base URL for public MLS listings (we'll use Realtor.com as it's public)
const BASE_URL = 'https://www.realtor.com/realestateandhomes-search'

export const fetchMLSListings = async (bounds) => {
  try {
    // Construct the search URL with bounds
    const searchParams = new URLSearchParams({
      lat: bounds.getCenter().lat,
      lon: bounds.getCenter().lng,
      radius: 5, // 5 mile radius
      view: 'map'
    })

    const response = await axios.get(`${BASE_URL}?${searchParams}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    const listings = []

    // Parse the listings from the page
    $('.component_property-card').each((i, el) => {
      const $el = $(el)
      
      const listing = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            parseFloat($el.attr('data-longitude')),
            parseFloat($el.attr('data-latitude'))
          ]
        },
        properties: {
          id: $el.attr('data-listing-id'),
          address: $el.find('.card-address').text().trim(),
          price: parseFloat($el.find('.card-price').text().replace(/[$,]/g, '')),
          bedrooms: parseInt($el.find('[data-label="property-meta-beds"]').text()),
          bathrooms: parseFloat($el.find('[data-label="property-meta-baths"]').text()),
          squareFeet: parseInt($el.find('[data-label="property-meta-sqft"]').text().replace(/[^0-9]/g, '')),
          propertyType: $el.find('.property-type').text().trim(),
          listingDate: $el.find('.listing-date').text().trim(),
          photoUrl: $el.find('.photo-wrap img').attr('src')
        }
      }

      if (!isNaN(listing.geometry.coordinates[0]) && !isNaN(listing.geometry.coordinates[1])) {
        listings.push(listing)
      }
    })

    return {
      type: 'FeatureCollection',
      features: listings
    }
  } catch (error) {
    console.error('Error fetching MLS listings:', error)
    throw error
  }
}

// Function to get detailed property info
export const fetchPropertyDetails = async (propertyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/property/${propertyId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    
    return {
      description: $('.description-text').text().trim(),
      features: $('.features-list li').map((i, el) => $(el).text().trim()).get(),
      taxHistory: $('.tax-history tbody tr').map((i, el) => ({
        year: $(el).find('td:nth-child(1)').text().trim(),
        amount: $(el).find('td:nth-child(2)').text().trim()
      })).get(),
      priceHistory: $('.price-history tbody tr').map((i, el) => ({
        date: $(el).find('td:nth-child(1)').text().trim(),
        price: $(el).find('td:nth-child(2)').text().trim(),
        event: $(el).find('td:nth-child(3)').text().trim()
      })).get(),
      schools: $('.schools-list li').map((i, el) => ({
        name: $(el).find('.school-name').text().trim(),
        rating: $(el).find('.school-rating').text().trim(),
        distance: $(el).find('.school-distance').text().trim()
      })).get()
    }
  } catch (error) {
    console.error('Error fetching property details:', error)
    throw error
  }
} 