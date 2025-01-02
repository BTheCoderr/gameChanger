import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import Dashboard from './Dashboard'
import Map from './Map'

function MainLayout() {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Only show AppBar on the dashboard page */}
      <Routes>
        <Route path="/" element={
          <>
            <AppBar position="static" sx={{ bgcolor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}>
              <Toolbar>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1, 
                    cursor: 'pointer',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}
                  onClick={() => navigate('/')}
                >
                  Game Changer
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/map')}
                  sx={{
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Launch Demo
                </Button>
              </Toolbar>
            </AppBar>
            <Dashboard />
          </>
        } />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Box>
  )
}

export default MainLayout 