import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const MAX_PARALLEL_REQUESTS = 5;

class ScraperService {
  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
    this.activeRequests = 0;
  }

  async scrapeCountyRecords(counties, address) {
    const cacheKey = `${counties.join('-')}-${address}`;
    const cachedResult = this.getCachedResult(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }

    const tasks = counties.map(county => ({
      id: uuidv4(),
      county,
      address,
      retries: 0
    }));

    this.requestQueue.push(...tasks);
    const results = await this.processQueue();
    
    const validResults = results.filter(result => result && !result.error);
    if (validResults.length > 0) {
      this.cacheResult(cacheKey, validResults);
    }

    return validResults;
  }

  getCachedResult(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  cacheResult(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async processQueue() {
    const results = [];
    
    while (this.requestQueue.length > 0 || this.activeRequests > 0) {
      while (this.activeRequests < MAX_PARALLEL_REQUESTS && this.requestQueue.length > 0) {
        const task = this.requestQueue.shift();
        this.activeRequests++;
        
        this.processTask(task)
          .then(result => {
            if (result) {
              results.push(result);
            }
          })
          .catch(error => {
            console.error(`Error processing task for ${task.county}:`, error);
            if (task.retries < MAX_RETRIES) {
              task.retries++;
              this.requestQueue.push(task);
            }
          })
          .finally(() => {
            this.activeRequests--;
          });
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  async processTask(task) {
    try {
      const result = await this.scrapeCounty(task.county, task.address);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return this.validateAndCleanData(result);
    } catch (error) {
      if (task.retries < MAX_RETRIES) {
        throw error;
      }
      return null;
    }
  }

  async scrapeCounty(county, address) {
    const baseUrl = `https://api.backend.com/scrape/${county}`;
    try {
      const response = await axios.post(baseUrl, { address });
      return response.data;
    } catch (error) {
      console.error(`Error scraping ${county}:`, error);
      throw error;
    }
  }

  validateAndCleanData(data) {
    if (!data) return null;

    // Remove any HTML tags
    const cleanHtml = (str) => str.replace(/<[^>]*>/g, '');

    // Basic data validation and cleaning
    const cleanData = {
      address: data.address ? cleanHtml(data.address.trim()) : null,
      owner: data.owner ? cleanHtml(data.owner.trim()) : null,
      lastSaleDate: data.lastSaleDate ? new Date(data.lastSaleDate).toISOString() : null,
      lastSalePrice: data.lastSalePrice ? parseFloat(data.lastSalePrice.replace(/[^0-9.]/g, '')) : null,
      assessedValue: data.assessedValue ? parseFloat(data.assessedValue.replace(/[^0-9.]/g, '')) : null,
      propertyType: data.propertyType ? cleanHtml(data.propertyType.trim()) : null,
      yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
      squareFeet: data.squareFeet ? parseInt(data.squareFeet) : null,
      lotSize: data.lotSize ? parseFloat(data.lotSize) : null,
      zoning: data.zoning ? cleanHtml(data.zoning.trim()) : null
    };

    // Validate required fields
    if (!cleanData.address || !cleanData.owner) {
      return null;
    }

    return cleanData;
  }
}

export const scraperService = new ScraperService(); 