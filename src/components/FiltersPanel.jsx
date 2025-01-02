import React from 'react'
import PropTypes from 'prop-types'
import { Box, Typography, Switch, FormGroup, FormControlLabel } from '@mui/material'
import ElectricCarIcon from '@mui/icons-material/ElectricCar'
import TranslateIcon from '@mui/icons-material/Translate'
import InsightsIcon from '@mui/icons-material/Insights'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import HomeIcon from '@mui/icons-material/Home'
import BusinessIcon from '@mui/icons-material/Business'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'

const FiltersPanel = ({ activeLayers, onLayersChange }) => {
  const handleLayerToggle = (layer) => {
    onLayersChange({
      ...activeLayers,
      [layer]: !activeLayers[layer]
    })
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: '#ffffff',
        width: '250px',
        height: '100vh',
        overflow: 'auto',
        color: '#333',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
        borderRight: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#333',
          backgroundColor: '#f8f9fa',
          position: 'sticky',
          top: 0
        }}
      >
        Layers
      </Typography>
      <FormGroup sx={{ padding: '8px 0' }}>
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.leads}
              onChange={() => handleLayerToggle('leads')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BusinessIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>Leads</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.neighborhoodInsights}
              onChange={() => handleLayerToggle('neighborhoodInsights')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <InsightsIcon sx={{ fontSize: 20, color: '#2196F3' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>Neighborhood Insights</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.utilityBoundaries}
              onChange={() => handleLayerToggle('utilityBoundaries')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HomeWorkIcon sx={{ fontSize: 20, color: '#9C27B0' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>Utility Boundaries</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.solarPermits}
              onChange={() => handleLayerToggle('solarPermits')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SolarPowerIcon sx={{ fontSize: 20, color: '#FDD835' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>Solar Permits</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.moveIns}
              onChange={() => handleLayerToggle('moveIns')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HomeIcon sx={{ fontSize: 20, color: '#E91E63' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>Move Ins</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.cityBoundaries}
              onChange={() => handleLayerToggle('cityBoundaries')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LocationCityIcon sx={{ fontSize: 20, color: '#00BCD4' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>City Boundaries</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.spanishSpeakers}
              onChange={() => handleLayerToggle('spanishSpeakers')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TranslateIcon sx={{ fontSize: 20, color: '#FF9800' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>Spanish Speakers</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.manufacturedHomes}
              onChange={() => handleLayerToggle('manufacturedHomes')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HomeIcon sx={{ fontSize: 20, color: '#795548' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>Manufactured Homes</Typography>
            </Box>
          }
        />
        <FormControlLabel
          sx={{ 
            margin: 0,
            padding: '8px 20px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
          control={
            <Switch
              checked={activeLayers.evOwners}
              onChange={() => handleLayerToggle('evOwners')}
              size="small"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DirectionsCarIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
              <Typography sx={{ fontSize: 14, color: '#333' }}>EV Owners</Typography>
            </Box>
          }
        />
      </FormGroup>
    </Box>
  )
}

FiltersPanel.propTypes = {
  activeLayers: PropTypes.shape({
    leads: PropTypes.bool,
    neighborhoodInsights: PropTypes.bool,
    utilityBoundaries: PropTypes.bool,
    solarPermits: PropTypes.bool,
    moveIns: PropTypes.bool,
    cityBoundaries: PropTypes.bool,
    spanishSpeakers: PropTypes.bool,
    manufacturedHomes: PropTypes.bool,
    evOwners: PropTypes.bool
  }).isRequired,
  onLayersChange: PropTypes.func.isRequired
}

export default FiltersPanel 