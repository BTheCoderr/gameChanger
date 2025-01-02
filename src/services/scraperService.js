import axios from 'axios';
import * as cheerio from 'cheerio';

// Base URLs for different property websites
const ZILLOW_URL = 'https://www.zillow.com/homes';
const REALTOR_URL = 'https://www.realtor.com/realestateandhomes-search';
const HAMPDEN_RECORDS_URL = 'https://www.masslandrecords.com/hampden';
const WORCESTER_RECORDS_URL = 'https://www.masslandrecords.com/worcester';

// Function to scrape Zillow listings
export const scrapeZillowListings = async (bounds) => {
  try {
    const response = await axios.get(`${ZILLOW_URL}/Springfield-MA`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const listings = [];

    // Parse property cards
    $('.property-card').each((i, el) => {
      const address = $(el).find('.property-card-addr').text().trim();
      const price = $(el).find('.property-card-price').text().trim();
      const details = $(el).find('.property-card-details').text().trim();
      
      listings.push({
        address,
        price,
        details,
        source: 'Zillow'
      });
    });

    return listings;
  } catch (error) {
    console.error('Error scraping Zillow:', error);
    return [];
  }
};

// Function to scrape Realtor.com listings
export const scrapeRealtorListings = async (bounds) => {
  try {
    const response = await axios.get(`${REALTOR_URL}/Springfield_MA`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const listings = [];

    // Parse property cards
    $('.component_property-card').each((i, el) => {
      const address = $(el).find('.card-address').text().trim();
      const price = $(el).find('.card-price').text().trim();
      const details = $(el).find('.card-details').text().trim();
      
      listings.push({
        address,
        price,
        details,
        source: 'Realtor.com'
      });
    });

    return listings;
  } catch (error) {
    console.error('Error scraping Realtor.com:', error);
    return [];
  }
};

// Function to scrape Hampden County property records
export const scrapeHampdenRecords = async (address) => {
  try {
    const response = await axios.get(`${HAMPDEN_RECORDS_URL}/search/property`, {
      params: { q: address },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const records = [];

    // Parse property records
    $('.search-result').each((i, el) => {
      const recordDate = $(el).find('.record-date').text().trim();
      const recordType = $(el).find('.record-type').text().trim();
      const recordDetails = $(el).find('.record-details').text().trim();
      
      records.push({
        date: recordDate,
        type: recordType,
        details: recordDetails,
        source: 'Hampden County Records'
      });
    });

    return records;
  } catch (error) {
    console.error('Error scraping Hampden County records:', error);
    return [];
  }
};

// Function to scrape Worcester County property records
export const scrapeWorcesterRecords = async (address) => {
  try {
    const response = await axios.get(`${WORCESTER_RECORDS_URL}/search/property`, {
      params: { q: address },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const records = [];

    // Parse property records
    $('.search-result').each((i, el) => {
      const recordDate = $(el).find('.record-date').text().trim();
      const recordType = $(el).find('.record-type').text().trim();
      const recordDetails = $(el).find('.record-details').text().trim();
      
      records.push({
        date: recordDate,
        type: recordType,
        details: recordDetails,
        source: 'Worcester County Records'
      });
    });

    return records;
  } catch (error) {
    console.error('Error scraping Worcester County records:', error);
    return [];
  }
}; 