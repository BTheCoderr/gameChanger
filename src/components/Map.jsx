import { useCallback, useState, useEffect } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, InputAdornment, IconButton, Collapse, Paper, Typography } from '@mui/material';
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import SatelliteIcon from '@mui/icons-material/Satellite';
import CloseIcon from '@mui/icons-material/Close';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 42.1015,
  lng: -72.5898
};

const options = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeId: 'satellite'
};

// Keep libraries constant to prevent reloads
const libraries = ['places', 'geometry', 'drawing'];

async function fetchNeighborhoodBoundary(map, placeName) {
  const geocoder = new window.google.maps.Geocoder();
  
  try {
    const response = await new Promise((resolve, reject) => {
      geocoder.geocode({
        address: placeName,
        componentRestrictions: { country: 'US' }
      }, (results, status) => {
        if (status === 'OK') {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });

    if (response[0].geometry) {
      const place = response[0];
      
      // Create a polygon to represent the neighborhood
      const paths = await new Promise(resolve => {
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails({
          placeId: place.place_id,
          fields: ['geometry', 'name', 'formatted_address', 'types']
        }, (result, status) => {
          if (status === 'OK' && result.geometry && result.geometry.viewport) {
            // Get the viewport corners
            const ne = result.geometry.viewport.getNorthEast();
            const sw = result.geometry.viewport.getSouthWest();
            
            // Create a more natural-looking boundary by adding intermediate points
            const numPoints = 12;
            const paths = [];
            
            for (let i = 0; i <= numPoints; i++) {
              const lat = sw.lat() + (ne.lat() - sw.lat()) * (Math.sin(i * Math.PI / numPoints) + 1) / 2;
              const lng = sw.lng() + (ne.lng() - sw.lng()) * (Math.cos(i * Math.PI / numPoints) + 1) / 2;
              paths.push([lng, lat]);
            }
            
            resolve(paths);
          } else {
            // Fallback to viewport bounds if detailed geometry isn't available
            const ne = place.geometry.viewport.getNorthEast();
            const sw = place.geometry.viewport.getSouthWest();
            resolve([
              [sw.lng(), ne.lat()],
              [ne.lng(), ne.lat()],
              [ne.lng(), sw.lat()],
              [sw.lng(), sw.lat()],
              [sw.lng(), ne.lat()]
            ]);
          }
        });
      });

      // Create GeoJSON feature
      const feature = {
        type: 'Feature',
        properties: {
          name: place.address_components[0].long_name,
          placeId: place.place_id,
          // Add mock stats for now - these would come from your database or Census API
          medianIncome: '$45,000',
          homeownership: '65%',
          avgHomeValue: '$275,000'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [paths]
        }
      };

      // Add the feature to the map's data layer
      map.data.addGeoJson({
        type: 'FeatureCollection',
        features: [feature]
      });

      return feature;
    }
  } catch (error) {
    console.error('Error fetching neighborhood:', error);
    return null;
  }
}

function Map({ activeLayers, onLayerToggle }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onAutocompleteLoad = useCallback((autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        map?.panTo(location);
        map?.setZoom(17);
        setIsSearchOpen(false);
      }
    }
  }, [autocomplete, map]);

  // Load neighborhood boundaries when map is ready and layer is active
  useEffect(() => {
    if (!map || !activeLayers.neighborhoodInsights) return;

    const loadNeighborhoods = async () => {
      // Clear existing features
      map.data.forEach(feature => map.data.remove(feature));

      // List of neighborhoods to fetch
      const neighborhoodsList = [
        'Downtown Springfield, MA',
        'Forest Park, Springfield, MA',
        'Liberty Heights, Springfield, MA',
        'Indian Orchard, Springfield, MA',
        'East Springfield, MA',
        'Pine Point, Springfield, MA',
        'Sixteen Acres, Springfield, MA',
        'South End, Springfield, MA',
        'North End, Springfield, MA',
        'East Forest Park, Springfield, MA'
      ];

      try {
        await Promise.all(
          neighborhoodsList.map(name => fetchNeighborhoodBoundary(map, name))
        );

        // Style the boundaries
        map.data.setStyle({
          fillColor: '#ED6C02',
          fillOpacity: 0.1,
          strokeColor: '#ED6C02',
          strokeWeight: 2,
          strokeOpacity: 0.8
        });

        // Add click listener for info windows
        map.data.addListener('click', (event) => {
          const feature = event.feature;
          const bounds = new window.google.maps.LatLngBounds();
          
          feature.getGeometry().forEachLatLng(latLng => {
            bounds.extend(latLng);
          });
          
          setSelectedFeature({
            name: feature.getProperty('name'),
            stats: {
              medianIncome: feature.getProperty('medianIncome'),
              homeownership: feature.getProperty('homeownership'),
              avgHomeValue: feature.getProperty('avgHomeValue')
            }
          });
          setInfoWindowPosition(bounds.getCenter());
        });

        // Add hover effects
        map.data.addListener('mouseover', (event) => {
          map.data.overrideStyle(event.feature, {
            fillOpacity: 0.3,
            strokeWeight: 3
          });
        });

        map.data.addListener('mouseout', (event) => {
          map.data.revertStyle(event.feature);
        });
      } catch (error) {
        console.error('Error loading neighborhoods:', error);
      }
    };

    loadNeighborhoods();
  }, [map, activeLayers.neighborhoodInsights]);

  // Update map type
  useEffect(() => {
    if (!map) return;
    map.setMapTypeId(activeLayers.aerial ? 'satellite' : 'roadmap');
  }, [map, activeLayers.aerial]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 1200 }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1
        }}>
          <Collapse in={isSearchOpen} orientation="horizontal" sx={{ flexGrow: 1 }}>
            <Box sx={{ 
              display: 'flex',
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: 1,
              mr: 1
            }}>
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
                style={{ flex: 1 }}
              >
                <TextField
                  fullWidth
                  placeholder="Search locations..."
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Autocomplete>
            </Box>
          </Collapse>

          <Box sx={{ 
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: 1
          }}>
            {!isSearchOpen && (
              <IconButton 
                size="small" 
                onClick={() => setIsSearchOpen(true)}
                sx={{ mx: 0.5 }}
              >
                <SearchIcon />
              </IconButton>
            )}
            {isSearchOpen && (
              <IconButton 
                size="small" 
                onClick={() => setIsSearchOpen(false)}
                sx={{ mx: 0.5 }}
              >
                <CloseIcon />
              </IconButton>
            )}
            <ToggleButtonGroup
              value={activeLayers.aerial ? 'satellite' : 'map'}
              exclusive
              onChange={(e, v) => v !== null && onLayerToggle('aerial')}
              size="small"
              sx={{ 
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 0,
                  padding: '4px 12px',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="map">
                <MapIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="satellite">
                <SatelliteIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={17}
        options={options}
        onLoad={onLoad}
      />

      {/* Info Window */}
      {selectedFeature && infoWindowPosition && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -100%)',
            zIndex: 1000
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              minWidth: 200,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              position: 'relative'
            }}
          >
            <IconButton
              size="small"
              onClick={() => setSelectedFeature(null)}
              sx={{
                position: 'absolute',
                right: 4,
                top: 4
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" gutterBottom>{selectedFeature.name}</Typography>
            <Typography variant="body2">Median Income: {selectedFeature.stats.medianIncome}</Typography>
            <Typography variant="body2">Homeownership: {selectedFeature.stats.homeownership}</Typography>
            <Typography variant="body2">Avg Home Value: {selectedFeature.stats.avgHomeValue}</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

Map.propTypes = {
  activeLayers: PropTypes.object.isRequired,
  onLayerToggle: PropTypes.func.isRequired
};

export default Map;