import React, { useState, useRef, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { 
  GoogleMap, 
  useLoadScript, 
  Marker, 
  InfoWindow,
  MarkerClusterer,
  Data 
} from '@react-google-maps/api'
import FiltersPanel from './FiltersPanel'
import { fetchChargingStations } from '../services/nrelService'
import { fetchDemographicData } from '../services/censusService'
import { fetchPropertyData } from '../services/propertyService'
import { fetchUtilityData } from '../services/utilityService'
import { fetchSolarPermits } from '../services/permitService'

// Move these constants outside of the component
const libraries = ['places', 'visualization']

const mapContainerStyle = {
  width: 'calc(100% - 250px)',
  height: '100vh',
  marginLeft: '250px'
}

const center = {
  lat: 42.1015,
  lng: -72.5898
}

const options = {
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    }
  ],
  mapTypeId: 'hybrid'
}

// Memoize the callback functions
const createHandleBoundsChanged = (mapRef, handleDataFetch) => () => {
  if (!mapRef.current) return

  const bounds = mapRef.current.getBounds()
  handleDataFetch({
    minLat: bounds.getSouthWest().lat(),
    maxLat: bounds.getNorthEast().lat(),
    minLng: bounds.getSouthWest().lng(),
    maxLng: bounds.getNorthEast().lng()
  })
}

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  })

  const [chargingStations, setChargingStations] = useState([])
  const [demographicData, setDemographicData] = useState(null)
  const [properties, setProperties] = useState([])
  const [solarPermits, setSolarPermits] = useState([])
  const [utilityBoundaries, setUtilityBoundaries] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [activeLayers, setActiveLayers] = useState({
    leads: true,
    neighborhoodInsights: false,
    utilityBoundaries: false,
    solarPermits: false,
    moveIns: false,
    cityBoundaries: false,
    spanishSpeakers: false,
    manufacturedHomes: false,
    evOwners: false
  })

  const mapRef = useRef()
  
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])

  const handleDataFetch = React.useCallback(async (bounds) => {
    try {
      const fetchPromises = [];
      
      if (activeLayers.evOwners) {
        fetchPromises.push(fetchChargingStations(bounds));
      } else {
        fetchPromises.push(Promise.resolve([]));
      }

      if (activeLayers.utilityBoundaries) {
        fetchPromises.push(fetchUtilityData(bounds));
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      if (activeLayers.leads) {
        fetchPromises.push(fetchPropertyData(bounds));
      } else {
        fetchPromises.push(Promise.resolve([]));
      }

      if (activeLayers.solarPermits) {
        fetchPromises.push(fetchSolarPermits(bounds));
      } else {
        fetchPromises.push(Promise.resolve([]));
      }

      if (activeLayers.spanishSpeakers || activeLayers.cityBoundaries) {
        fetchPromises.push(fetchDemographicData(bounds));
      } else {
        fetchPromises.push(Promise.resolve(null));
      }

      const [stations, utilities, propertyData, permitData, demographic] = await Promise.all(fetchPromises);
      
      setChargingStations(stations);
      setUtilityBoundaries(utilities);
      setProperties(propertyData);
      setSolarPermits(permitData);
      setDemographicData(demographic);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [activeLayers]);

  const handleBoundsChanged = React.useCallback(
    createHandleBoundsChanged(mapRef, handleDataFetch),
    [handleDataFetch]
  );

  // Refetch data when active layers change
  useEffect(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      handleDataFetch({
        minLat: bounds.getSouthWest().lat(),
        maxLat: bounds.getNorthEast().lat(),
        minLng: bounds.getSouthWest().lng(),
        maxLng: bounds.getNorthEast().lng()
      });
    }
  }, [activeLayers, handleDataFetch]);

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps</div>

  return (
    <Box sx={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <FiltersPanel 
        activeLayers={activeLayers}
        onLayersChange={setActiveLayers}
      />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        options={options}
        onLoad={onMapLoad}
        onBoundsChanged={handleBoundsChanged}
      >
        {/* Leads Layer */}
        {activeLayers.leads && (
          <MarkerClusterer>
            {(clusterer) =>
              properties.map(property => (
                <Marker
                  key={property.id}
                  position={{ lat: property.latitude, lng: property.longitude }}
                  clusterer={clusterer}
                  icon={{
                    path: 'M -5,-5 L 5,-5 L 5,5 L -5,5 Z',  // Simple square shape
                    fillColor: '#4CAF50',
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 1
                  }}
                  onClick={() => setSelectedMarker(property)}
                />
              ))
            }
          </MarkerClusterer>
        )}

        {/* Solar Permits Layer */}
        {activeLayers.solarPermits && (
          <MarkerClusterer>
            {(clusterer) =>
              solarPermits.map(permit => (
                <Marker
                  key={permit.id}
                  position={{ lat: permit.latitude, lng: permit.longitude }}
                  clusterer={clusterer}
                  icon={{
                    path: 'M -5,-5 L 5,-5 L 5,5 L -5,5 Z',  // Simple square shape
                    fillColor: '#FDD835',
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 1
                  }}
                  onClick={() => setSelectedMarker(permit)}
                />
              ))
            }
          </MarkerClusterer>
        )}

        {/* EV Charging Stations Layer */}
        {activeLayers.evOwners && (
          <MarkerClusterer>
            {(clusterer) =>
              chargingStations.map(station => (
                <Marker
                  key={station.id}
                  position={{ lat: station.latitude, lng: station.longitude }}
                  clusterer={clusterer}
                  icon={{
                    path: 'M -5,-5 L 5,-5 L 5,5 L -5,5 Z',  // Simple square shape
                    fillColor: '#4CAF50',
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 1
                  }}
                  onClick={() => setSelectedMarker(station)}
                />
              ))
            }
          </MarkerClusterer>
        )}

        {/* Utility Boundaries Layer */}
        {activeLayers.utilityBoundaries && utilityBoundaries && (
          <Data
            onLoad={layer => {
              layer.addGeoJson(utilityBoundaries);
              layer.setStyle({
                fillColor: '#9C27B0',
                fillOpacity: 0.2,
                strokeColor: '#9C27B0',
                strokeWeight: 2
              });
            }}
          />
        )}

        {/* City Boundaries Layer */}
        {activeLayers.cityBoundaries && demographicData?.cityBoundaries && (
          <Data
            onLoad={layer => {
              layer.addGeoJson(demographicData.cityBoundaries);
              layer.setStyle({
                fillColor: '#00BCD4',
                fillOpacity: 0.2,
                strokeColor: '#00BCD4',
                strokeWeight: 2
              });
            }}
          />
        )}

        {/* Spanish Speakers Layer */}
        {activeLayers.spanishSpeakers && demographicData?.spanishSpeakers && (
          <Data
            onLoad={layer => {
              layer.addGeoJson(demographicData.spanishSpeakers);
              layer.setStyle(feature => ({
                fillColor: '#FF9800',
                fillOpacity: feature.getProperty('spanishSpeakers') / feature.getProperty('totalPopulation') * 0.5,
                strokeColor: '#FF9800',
                strokeWeight: 1
              }));
            }}
          />
        )}

        {/* Info Window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <Box sx={{ padding: '8px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedMarker.address || selectedMarker.name}
              </Typography>
              {selectedMarker.assessed_value && (
                <Typography variant="body2">
                  Assessed Value: ${selectedMarker.assessed_value.toLocaleString()}
                </Typography>
              )}
              {selectedMarker.year_built && (
                <Typography variant="body2">
                  Year Built: {selectedMarker.year_built}
                </Typography>
              )}
              {selectedMarker.system_size && (
                <Typography variant="body2">
                  Solar System Size: {selectedMarker.system_size} kW
                </Typography>
              )}
              {selectedMarker.ev_connector_types && (
                <Typography variant="body2">
                  Charger Types: {selectedMarker.ev_connector_types.join(', ')}
                </Typography>
              )}
              {selectedMarker.additional_data && (
                <>
                  <Typography variant="body2">
                    Zillow Price: {selectedMarker.additional_data.zillow_price}
                  </Typography>
                  <Typography variant="body2">
                    Realtor Price: {selectedMarker.additional_data.realtor_price}
                  </Typography>
                </>
              )}
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </Box>
  )
}

export default Map 