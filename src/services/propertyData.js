// Mock property listings data
export const mockListings = [
  {
    id: '1',
    position: [42.1015, -72.5898], // Springfield, MA
    properties: {
      address: '123 Main St, Springfield, MA',
      price: 350000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      yearBuilt: 1985,
      propertyType: 'Single Family'
    }
  },
  {
    id: '2',
    position: [42.1025, -72.5888],
    properties: {
      address: '456 Oak Ave, Springfield, MA',
      price: 425000,
      bedrooms: 4,
      bathrooms: 2.5,
      squareFeet: 2200,
      yearBuilt: 1992,
      propertyType: 'Single Family'
    }
  },
  {
    id: '3',
    position: [42.1005, -72.5878],
    properties: {
      address: '789 Elm St, Springfield, MA',
      price: 275000,
      bedrooms: 2,
      bathrooms: 1.5,
      squareFeet: 1500,
      yearBuilt: 1975,
      propertyType: 'Condo'
    }
  }
];

// Function to fetch property listings (to be implemented with real API later)
export const fetchPropertyListings = async (bounds, filters) => {
  // This would normally make an API call
  // For now, return mock data
  return mockListings;
}; 