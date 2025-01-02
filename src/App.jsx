<<<<<<< HEAD
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import MainLayout from './components/MainLayout'
import Dashboard from './components/Dashboard'
import Map from './components/Map'

function App() {
  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      bgcolor: '#1a1a1a'
    }}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </MainLayout>
    </Box>
  )
}

export default App 
=======
import { useState } from 'react';
import MainLayout from './components/MainLayout';

function App() {
  const [activeLayers, setActiveLayers] = useState({
    leads: false,
    neighborhoodInsights: false,
    utilityBoundaries: false,
    solarPermits: false,
    moveIns: false,
    cityBoundaries: false,
    spanishSpeakers: false,
    manufacturedHomes: false,
    evOwners: false,
    aerial: false
  });

  const handleLayerToggle = (layerName) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  return (
    <MainLayout 
      activeLayers={activeLayers} 
      onLayerToggle={handleLayerToggle}
    />
  );
}

export default App;
>>>>>>> 3220ebf9ee2c7374467e4bbb65e8015d3af3c7d4
