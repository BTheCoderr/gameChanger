<<<<<<< HEAD
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
=======
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import TerrainIcon from '@mui/icons-material/Terrain'
import BusinessIcon from '@mui/icons-material/Business'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import HomeIcon from '@mui/icons-material/Home'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import TranslateIcon from '@mui/icons-material/Translate'

const layerStyles = {
  leads: {
    color: '#4A90E2',
    icon: LocationOnIcon,
    description: 'View potential solar leads'
  },
  neighborhoodInsights: {
    color: '#ED6C02',
    icon: TerrainIcon,
    description: 'View demographic and housing data'
  },
  utilityBoundaries: {
    color: '#1976D2',
    icon: BusinessIcon,
    description: 'Show utility service areas'
  },
  solarPermits: {
    color: '#FFC107',
    icon: SolarPowerIcon,
    description: 'View solar permit applications'
  },
  moveIns: {
    color: '#4CAF50',
    icon: HomeIcon,
    description: 'View recent move-ins'
  },
  cityBoundaries: {
    color: '#2E7D32',
    icon: LocationCityIcon,
    description: 'Show city boundaries'
  },
  spanishSpeakers: {
    color: '#9C27B0',
    icon: TranslateIcon,
    description: 'Spanish speaking households'
  }
};

function FiltersPanel({ activeLayers, onLayersChange }) {
  const [open, setOpen] = useState(false);

  const handleLayerChange = (layer) => (event) => {
    const newLayers = {
      ...activeLayers,
      [layer]: event.target.checked
    };
    onLayersChange(newLayers);
  };

  const LayerToggle = ({ layer, label }) => {
    const style = layerStyles[layer];
    return (
      <Box sx={{ mb: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={activeLayers[layer]}
              onChange={handleLayerChange(layer)}
              sx={{
                color: style.color,
                '&.Mui-checked': {
                  color: style.color,
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <style.icon sx={{ color: style.color, mr: 1 }} />
              <Box>
                <Typography variant="body2">{label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {style.description}
                </Typography>
              </Box>
            </Box>
          }
        />
      </Box>
    );
  };

  if (!open) {
    return (
      <Tooltip title="Show Layers">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'white',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }
          }}
        >
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        width: 320,
        maxHeight: 'calc(100vh - 40px)',
        overflow: 'auto',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Layers</Typography>
        <IconButton onClick={() => setOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <LayerToggle layer="leads" label="Leads" />
        <LayerToggle layer="neighborhoodInsights" label="Neighborhood Insights" />
        <LayerToggle layer="utilityBoundaries" label="Utility Boundaries" />
        <LayerToggle layer="solarPermits" label="Solar Permits" />
        <LayerToggle layer="moveIns" label="Move Ins" />
        <LayerToggle layer="cityBoundaries" label="City Boundaries" />
        <LayerToggle layer="spanishSpeakers" label="Spanish Speakers" />
      </Box>

      {/* Map Type Toggle */}
      <Box sx={{ p: 2, pt: 0 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={activeLayers.aerial}
              onChange={handleLayerChange('aerial')}
            />
          }
          label={
            <Box>
              <Typography variant="body2">Use current aerial imagery</Typography>
              <Typography variant="caption" color="text.secondary">
                Toggle between aerial and map view
              </Typography>
            </Box>
          }
        />
      </Box>
    </Paper>
  );
}

FiltersPanel.propTypes = {
  activeLayers: PropTypes.object.isRequired,
  onLayersChange: PropTypes.func.isRequired
};

export default FiltersPanel;
>>>>>>> 3220ebf9ee2c7374467e4bbb65e8015d3af3c7d4
