let leadCounter = 0;

// Helper function to generate random coordinates within a radius
function generateRandomPoint(centerLat, centerLng, radiusKm) {
  const radiusEarth = 6371; // Earth's radius in kilometers
  const randomDistance = Math.sqrt(Math.random()) * radiusKm;
  const randomAngle = Math.random() * Math.PI * 2;
  
  const lat = Math.asin(
    Math.sin(centerLat * Math.PI / 180) * Math.cos(randomDistance / radiusEarth) +
    Math.cos(centerLat * Math.PI / 180) * Math.sin(randomDistance / radiusEarth) * Math.cos(randomAngle)
  ) * 180 / Math.PI;
  
  const lng = centerLng + Math.atan2(
    Math.sin(randomAngle) * Math.sin(randomDistance / radiusEarth) * Math.cos(centerLat * Math.PI / 180),
    Math.cos(randomDistance / radiusEarth) - Math.sin(centerLat * Math.PI / 180) * Math.sin(lat * Math.PI / 180)
  ) * 180 / Math.PI;
  
  return [lat, lng];
}

// Generate a cluster of points around a center point
function generateCluster(centerLat, centerLng, count, radiusKm = 5, prefix, options = {}) {
  const points = [];
  const {
    minIncome = 50000,
    maxIncome = 150000,
    minHomeValue = 200000,
    maxHomeValue = 800000,
    minHomeSize = 1200,
    maxHomeSize = 3500,
    minHouseholds = 100,
    maxHouseholds = 500,
    yearRangeStart = 1950,
    yearRangeSpan = 40
  } = options;

  for (let i = 0; i < count; i++) {
    leadCounter++;
    const [lat, lng] = generateRandomPoint(centerLat, centerLng, radiusKm);
    
    // Generate realistic property values
    const income = Math.floor(Math.random() * (maxIncome - minIncome) + minIncome);
    const homeValue = Math.floor(Math.random() * (maxHomeValue - minHomeValue) + minHomeValue);
    const homeSize = Math.floor(Math.random() * (maxHomeSize - minHomeSize) + minHomeSize);
    const households = Math.floor(Math.random() * (maxHouseholds - minHouseholds) + minHouseholds);
    const startYear = yearRangeStart + Math.floor(Math.random() * yearRangeSpan);
    
    points.push({
      id: `${prefix}-lead-${leadCounter}`,
      position: [lat, lng],
      properties: {
        totalHouseholds: households,
        ownerOccupied: `${Math.floor(Math.random() * 40 + 60)}%`,
        electricHeating: `${Math.floor(Math.random() * 20 + 5)}%`,
        avgIncome: `$${income.toLocaleString()}`,
        avgHomeValue: `$${homeValue.toLocaleString()}`,
        buildYearRange: `${startYear}-${startYear + 10}`,
        avgHomeSize: `${homeSize.toLocaleString()} sq. ft.`,
        solarPotential: `${Math.floor(Math.random() * 500 + 500)} kWh/year`,
        roofArea: `${Math.floor(Math.random() * 500 + 1000)} sq. ft.`,
        treeShade: `${Math.floor(Math.random() * 30)}%`
      }
    });
  }
  return points;
}

// Generate clusters of leads around Springfield, MA
const springfieldClusters = [
  { lat: 42.1015, lng: -72.5898, count: 50, radius: 3 }, // Downtown Springfield
  { lat: 42.1182, lng: -72.5977, count: 30, radius: 2 }, // Liberty Heights
  { lat: 42.0895, lng: -72.5785, count: 40, radius: 2.5 }, // Forest Park
  { lat: 42.1276, lng: -72.5454, count: 35, radius: 2 }, // Indian Orchard
  { lat: 42.0998, lng: -72.6511, count: 25, radius: 2 }, // West Springfield
];

export const leads = springfieldClusters.flatMap(cluster => 
  generateCluster(cluster.lat, cluster.lng, cluster.count, cluster.radius, 'spfld', {
    minIncome: 45000,
    maxIncome: 120000,
    minHomeValue: 180000,
    maxHomeValue: 600000,
    minHomeSize: 1000,
    maxHomeSize: 3000,
    minHouseholds: 80,
    maxHouseholds: 400,
    yearRangeStart: 1960,
    yearRangeSpan: 50
  })
);

// Utility boundaries GeoJSON data
export const utilityBoundaries = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Eversource',
        color: '#4CAF50',
        borderColor: '#388E3C',
        stats: {
          totalCustomers: '1.2M',
          avgBill: '$150',
          solarAdoption: '15%'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.7, 42.2],
          [-72.4, 42.2],
          [-72.4, 42.0],
          [-72.7, 42.0],
          [-72.7, 42.2]
        ]]
      }
    }
  ]
};

// Solar permits data
export const solarPermits = Array.from({ length: 100 }, (_, i) => ({
  id: `solar-${i + 1}`,
  position: generateRandomPoint(42.1015, -72.5898, 8),
  properties: {
    type: ['Residential', 'Commercial'][Math.floor(Math.random() * 2)],
    status: ['Pending', 'Approved', 'Completed'][Math.floor(Math.random() * 3)],
    date: new Date(2023 - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    capacity: Math.floor(Math.random() * 10 + 5) + 'kW',
    contractor: ['SunPower', 'Tesla', 'Local Solar Co', 'Green Energy Inc'][Math.floor(Math.random() * 4)]
  }
}));

// Move-ins data
export const moveIns = Array.from({ length: 80 }, (_, i) => ({
  id: `movein-${i + 1}`,
  position: generateRandomPoint(42.1015, -72.5898, 7),
  properties: {
    propertyType: ['Single Family', 'Multi Family', 'Condo'][Math.floor(Math.random() * 3)],
    moveInDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
    hasChildren: ['Yes', 'No'][Math.floor(Math.random() * 2)],
    previousLocation: ['Out of State', 'In State', 'Local'][Math.floor(Math.random() * 3)]
  }
}));

// City boundaries GeoJSON data
export const cityBoundaries = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Springfield',
        color: '#2196F3',
        borderColor: '#1976D2',
        stats: {
          population: '155,000',
          medianIncome: '$45,000',
          homeownership: '48%'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.65, 42.15],
          [-72.45, 42.15],
          [-72.45, 42.05],
          [-72.65, 42.05],
          [-72.65, 42.15]
        ]]
      }
    }
  ]
};

// MLS listings data
export const mlsListings = Array.from({ length: 50 }, (_, i) => ({
  id: `mls-${i + 1}`,
  position: generateRandomPoint(42.1015, -72.5898, 6),
  properties: {
    listingId: `MLS${Math.floor(Math.random() * 900000 + 100000)}`,
    price: Math.floor(Math.random() * 400000 + 200000),
    bedrooms: Math.floor(Math.random() * 3 + 2),
    bathrooms: Math.floor(Math.random() * 2 + 1.5),
    squareFeet: Math.floor(Math.random() * 1500 + 1000),
    propertyType: ['Single Family', 'Condo', 'Multi Family'][Math.floor(Math.random() * 3)],
    yearBuilt: Math.floor(Math.random() * 70 + 1950),
    daysOnMarket: Math.floor(Math.random() * 90),
    status: ['Active', 'Under Contract', 'New'][Math.floor(Math.random() * 3)],
    address: `${Math.floor(Math.random() * 999 + 1)} ${[
      'Maple St',
      'Oak Ave',
      'Main St',
      'Washington Rd',
      'Park Dr'
    ][Math.floor(Math.random() * 5)]}, Springfield, MA`,
    features: [
      'Central Air',
      'Garage',
      'Fireplace',
      'Updated Kitchen',
      'Hardwood Floors',
      'Deck',
      'Pool',
      'Finished Basement'
    ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4 + 2))
  }
}));

// Neighborhood boundaries GeoJSON data
export const neighborhoodBoundaries = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'spfld-downtown',
        name: 'Downtown Springfield',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$35,000',
          homeownership: '25%',
          avgHomeValue: '$180,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.589760, 42.106091],
          [-72.589846, 42.103991],
          [-72.588859, 42.101891],
          [-72.586713, 42.101634],
          [-72.584181, 42.101505],
          [-72.581778, 42.101505],
          [-72.580190, 42.102305],
          [-72.579632, 42.104091],
          [-72.580061, 42.105677],
          [-72.581692, 42.106648],
          [-72.584267, 42.107134],
          [-72.586885, 42.107005],
          [-72.589760, 42.106091]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-north-end',
        name: 'North End',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$32,000',
          homeownership: '28%',
          avgHomeValue: '$165,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.589932, 42.112145],
          [-72.588473, 42.109876],
          [-72.586885, 42.107892],
          [-72.584524, 42.107134],
          [-72.581692, 42.107005],
          [-72.579632, 42.107649],
          [-72.578516, 42.109234],
          [-72.578344, 42.111349],
          [-72.579460, 42.113463],
          [-72.581692, 42.114749],
          [-72.584524, 42.115077],
          [-72.587013, 42.114749],
          [-72.589073, 42.113463],
          [-72.589932, 42.112145]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-south-end',
        name: 'South End',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$33,000',
          homeownership: '22%',
          avgHomeValue: '$170,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.589760, 42.099777],
          [-72.588859, 42.097663],
          [-72.586885, 42.096377],
          [-72.584267, 42.095733],
          [-72.581692, 42.095733],
          [-72.579632, 42.096377],
          [-72.578516, 42.097663],
          [-72.578344, 42.099777],
          [-72.579460, 42.101891],
          [-72.581692, 42.102949],
          [-72.584267, 42.103277],
          [-72.586885, 42.102949],
          [-72.588859, 42.101891],
          [-72.589760, 42.099777]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-forest-park',
        name: 'Forest Park',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$45,000',
          homeownership: '65%',
          avgHomeValue: '$275,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.578516, 42.089591],
          [-72.577229, 42.087934],
          [-72.575255, 42.086963],
          [-72.572594, 42.086391],
          [-72.569847, 42.086391],
          [-72.567787, 42.087191],
          [-72.566714, 42.088934],
          [-72.566714, 42.090520],
          [-72.567787, 42.092106],
          [-72.569847, 42.093163],
          [-72.572594, 42.093649],
          [-72.575255, 42.093649],
          [-72.577229, 42.092877],
          [-72.578516, 42.091220],
          [-72.578516, 42.089591]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-sixteen-acres',
        name: 'Sixteen Acres',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$58,000',
          homeownership: '75%',
          avgHomeValue: '$295,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.548737, 42.115077],
          [-72.547278, 42.112963],
          [-72.545304, 42.111677],
          [-72.542686, 42.111033],
          [-72.540111, 42.111033],
          [-72.538051, 42.111677],
          [-72.536935, 42.112963],
          [-72.536763, 42.115077],
          [-72.537879, 42.117191],
          [-72.540111, 42.118249],
          [-72.542686, 42.118577],
          [-72.545304, 42.118249],
          [-72.547278, 42.117191],
          [-72.548737, 42.115077]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-east-forest-park',
        name: 'East Forest Park',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$52,000',
          homeownership: '72%',
          avgHomeValue: '$310,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.569798, 42.091500],
          [-72.568339, 42.089386],
          [-72.566365, 42.088100],
          [-72.563747, 42.087456],
          [-72.561172, 42.087456],
          [-72.559112, 42.088100],
          [-72.557996, 42.089386],
          [-72.557824, 42.091500],
          [-72.558940, 42.093614],
          [-72.561172, 42.094672],
          [-72.563747, 42.095000],
          [-72.566365, 42.094672],
          [-72.568339, 42.093614],
          [-72.569798, 42.091500]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-liberty',
        name: 'Liberty Heights',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$42,000',
          homeownership: '55%',
          avgHomeValue: '$230,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.597760, 42.118277],
          [-72.596473, 42.116620],
          [-72.594499, 42.115649],
          [-72.591838, 42.115077],
          [-72.589091, 42.115077],
          [-72.587031, 42.115877],
          [-72.585958, 42.117620],
          [-72.585958, 42.119206],
          [-72.587031, 42.120792],
          [-72.589091, 42.121849],
          [-72.591838, 42.122335],
          [-72.594499, 42.122335],
          [-72.596473, 42.121563],
          [-72.597760, 42.119906],
          [-72.597760, 42.118277]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-indian-orchard',
        name: 'Indian Orchard',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$48,000',
          homeownership: '62%',
          avgHomeValue: '$245,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.545475, 42.127620],
          [-72.544188, 42.125963],
          [-72.542214, 42.124992],
          [-72.539553, 42.124420],
          [-72.536806, 42.124420],
          [-72.534746, 42.125220],
          [-72.533673, 42.126963],
          [-72.533673, 42.128549],
          [-72.534746, 42.130135],
          [-72.536806, 42.131192],
          [-72.539553, 42.131678],
          [-72.542214, 42.131678],
          [-72.544188, 42.130906],
          [-72.545475, 42.129249],
          [-72.545475, 42.127620]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-east',
        name: 'East Springfield',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$41,000',
          homeownership: '58%',
          avgHomeValue: '$220,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.565475, 42.117620],
          [-72.564188, 42.115963],
          [-72.562214, 42.114992],
          [-72.559553, 42.114420],
          [-72.556806, 42.114420],
          [-72.554746, 42.115220],
          [-72.553673, 42.116963],
          [-72.553673, 42.118549],
          [-72.554746, 42.120135],
          [-72.556806, 42.121192],
          [-72.559553, 42.121678],
          [-72.562214, 42.121678],
          [-72.564188, 42.120906],
          [-72.565475, 42.119249],
          [-72.565475, 42.117620]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'spfld-pine-point',
        name: 'Pine Point',
        city: 'Springfield',
        state: 'MA',
        stats: {
          medianIncome: '$46,000',
          homeownership: '65%',
          avgHomeValue: '$255,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.558940, 42.109234],
          [-72.557653, 42.107577],
          [-72.555679, 42.106606],
          [-72.553018, 42.106034],
          [-72.550271, 42.106034],
          [-72.548211, 42.106834],
          [-72.547138, 42.108577],
          [-72.547138, 42.110163],
          [-72.548211, 42.111749],
          [-72.550271, 42.112806],
          [-72.553018, 42.113292],
          [-72.555679, 42.113292],
          [-72.557653, 42.112520],
          [-72.558940, 42.110863],
          [-72.558940, 42.109234]
        ]]
      }
    },
    // Start Holyoke Neighborhoods
    {
      type: 'Feature',
      properties: {
        id: 'holy-downtown',
        name: 'Downtown Holyoke',
        city: 'Holyoke',
        state: 'MA',
        stats: {
          medianIncome: '$32,000',
          homeownership: '22%',
          avgHomeValue: '$175,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.602267, 42.207134],
          [-72.600980, 42.205477],
          [-72.599006, 42.204506],
          [-72.596345, 42.203934],
          [-72.593598, 42.203934],
          [-72.591538, 42.204734],
          [-72.590465, 42.206477],
          [-72.590465, 42.208063],
          [-72.591538, 42.209649],
          [-72.593598, 42.210706],
          [-72.596345, 42.211192],
          [-72.599006, 42.211192],
          [-72.600980, 42.210420],
          [-72.602267, 42.208763],
          [-72.602267, 42.207134]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'holy-highlands',
        name: 'The Highlands',
        city: 'Holyoke',
        state: 'MA',
        stats: {
          medianIncome: '$55,000',
          homeownership: '68%',
          avgHomeValue: '$285,000'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.623598, 42.215077],
          [-72.622311, 42.213420],
          [-72.620337, 42.212449],
          [-72.617676, 42.211877],
          [-72.614929, 42.211877],
          [-72.612869, 42.212677],
          [-72.611796, 42.214420],
          [-72.611796, 42.216006],
          [-72.612869, 42.217592],
          [-72.614929, 42.218649],
          [-72.617676, 42.219135],
          [-72.620337, 42.219135],
          [-72.622311, 42.218363],
          [-72.623598, 42.216706],
          [-72.623598, 42.215077]
        ]]
      }
    }
  ]
};

// Helper function to get boundaries for a specific city
export function getCityBoundaries(cityName, stateName) {
  return {
    type: 'FeatureCollection',
    features: neighborhoodBoundaries.features.filter(
      feature => feature.properties.city === cityName && feature.properties.state === stateName
    )
  };
}

// Helper function to get all available cities
export function getAvailableCities() {
  const cities = new Set();
  neighborhoodBoundaries.features.forEach(feature => {
    cities.add(`${feature.properties.city}, ${feature.properties.state}`);
  });
  return Array.from(cities);
}