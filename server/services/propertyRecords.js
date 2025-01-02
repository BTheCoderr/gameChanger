const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

// Registry URLs for all Massachusetts counties
const COUNTY_REGISTRIES = {
  BARNSTABLE: 'https://www.barnstabledeeds.org',
  BERKSHIRE: 'https://www.berkshiredeeds.com',
  BRISTOL: 'https://www.bristoldeeds.com',
  DUKES: 'https://www.masslandrecords.com/dukes',
  ESSEX_NORTH: 'https://www.northernessexdeeds.com',
  ESSEX_SOUTH: 'https://salemdeeds.com',
  FRANKLIN: 'https://www.masslandrecords.com/franklin',
  HAMPDEN: 'https://www.hampdendeeds.com',
  HAMPSHIRE: 'https://www.masslandrecords.com/hampshire',
  MIDDLESEX_NORTH: 'https://www.lowelldeeds.com',
  MIDDLESEX_SOUTH: 'https://www.middlesexsouthdeeds.com',
  NANTUCKET: 'https://www.masslandrecords.com/nantucket',
  NORFOLK: 'https://www.norfolkdeeds.org',
  PLYMOUTH: 'https://www.plymouthdeeds.org',
  SUFFOLK: 'https://www.masslandrecords.com/suffolk',
  WORCESTER: 'https://www.worcesterdeeds.com'
};

// Maximum retries for scraping attempts
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to delay between retries
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced scraping function with retries and more data fields
async function scrapeCountyRecords(county, address, retryCount = 0) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set longer timeout and add stealth
    await page.setDefaultNavigationTimeout(30000);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Get the correct URL for the county
    const baseUrl = COUNTY_REGISTRIES[county.toUpperCase()];
    if (!baseUrl) {
      throw new Error(`Unsupported county: ${county}`);
    }

    await page.goto(`${baseUrl}/search`);
    
    // Handle different search form structures
    try {
      await page.waitForSelector('input[type="text"]', { timeout: 5000 });
      await page.type('input[type="text"]', address);
      await page.keyboard.press('Enter');
    } catch (error) {
      console.warn(`Different search form structure for ${county}, trying alternative selectors`);
      const searchInput = await page.$('input[name="searchText"]') || 
                         await page.$('input[name="q"]') ||
                         await page.$('#searchBox');
      if (searchInput) {
        await searchInput.type(address);
        await searchInput.press('Enter');
      } else {
        throw new Error(`Unable to find search input for ${county}`);
      }
    }

    // Wait for results with longer timeout
    await page.waitForSelector('.search-results, .results-table, .property-details', { timeout: 10000 });
    const content = await page.content();
    const $ = cheerio.load(content);

    const results = [];
    $('.search-results tr, .results-table tr, .property-details').each((i, elem) => {
      const result = {
        address: $(elem).find('.property-address, .address').text().trim(),
        owner: $(elem).find('.owner-name, .owner').text().trim(),
        parcelId: $(elem).find('.parcel-id, .pid').text().trim(),
        lastSale: {
          date: $(elem).find('.sale-date, .last-sale-date').text().trim(),
          price: $(elem).find('.sale-price, .last-sale-price').text().trim(),
          type: $(elem).find('.sale-type, .deed-type').text().trim()
        },
        propertyDetails: {
          propertyType: $(elem).find('.property-type, .type').text().trim(),
          yearBuilt: $(elem).find('.year-built').text().trim(),
          livingArea: $(elem).find('.living-area, .sqft').text().trim(),
          lotSize: $(elem).find('.lot-size, .land-area').text().trim(),
          rooms: $(elem).find('.rooms, .room-count').text().trim(),
          bedrooms: $(elem).find('.bedrooms, .bed-count').text().trim(),
          bathrooms: $(elem).find('.bathrooms, .bath-count').text().trim()
        },
        assessment: {
          total: $(elem).find('.total-value, .assessed-value').text().trim(),
          building: $(elem).find('.building-value').text().trim(),
          land: $(elem).find('.land-value').text().trim(),
          fiscalYear: $(elem).find('.fiscal-year').text().trim()
        },
        zoning: {
          code: $(elem).find('.zoning-code').text().trim(),
          description: $(elem).find('.zoning-desc').text().trim()
        },
        documents: []
      };

      // Collect related documents
      $(elem).find('.documents tr, .deed-references tr').each((j, doc) => {
        result.documents.push({
          type: $(doc).find('.doc-type').text().trim(),
          date: $(doc).find('.doc-date').text().trim(),
          book: $(doc).find('.book').text().trim(),
          page: $(doc).find('.page').text().trim(),
          description: $(doc).find('.doc-desc').text().trim()
        });
      });

      if (result.address || result.parcelId) {
        results.push(result);
      }
    });

    return results;

  } catch (error) {
    console.error(`Error scraping ${county} records:`, error);
    
    // Implement retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying ${county} (Attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await delay(RETRY_DELAY);
      return scrapeCountyRecords(county, address, retryCount + 1);
    }
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Enhanced property records fetching with county detection
async function fetchPropertyRecords(address) {
  try {
    const geoData = await geocodeAddress(address);
    if (!geoData) return [];

    // Determine county from geocoded data
    const county = geoData.county?.toUpperCase().replace(' COUNTY', '');
    if (!county || !COUNTY_REGISTRIES[county]) {
      throw new Error(`Unsupported or unknown county: ${county}`);
    }

    const records = await scrapeCountyRecords(county, address);
    
    return records.map(record => ({
      id: record.parcelId,
      position: [geoData.lat, geoData.lng],
      properties: {
        address: record.address,
        owner: record.owner,
        lastSale: record.lastSale,
        propertyType: record.propertyDetails.propertyType,
        parcelId: record.parcelId,
        yearBuilt: record.propertyDetails.yearBuilt,
        livingArea: record.propertyDetails.livingArea,
        lotSize: record.propertyDetails.lotSize,
        rooms: record.propertyDetails.rooms,
        bedrooms: record.propertyDetails.bedrooms,
        bathrooms: record.propertyDetails.bathrooms,
        assessment: record.assessment,
        zoning: record.zoning,
        documents: record.documents,
        county: geoData.county,
        confidence: geoData.confidence
      }
    }));
  } catch (error) {
    console.error('Error processing property records:', error);
    return [];
  }
}

// Keep the existing geocodeAddress function
async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=us&state=massachusetts`
    );
    const data = await response.json();
    
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        confidence: parseInt(data[0].importance * 100),
        type: data[0].type,
        county: data[0].address?.county
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

module.exports = {
  fetchPropertyRecords,
  COUNTY_REGISTRIES // Export for testing purposes
}; 