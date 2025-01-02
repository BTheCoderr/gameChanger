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