import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Map from './Map'
import Sidebar from './Sidebar'

function MainLayout({ activeLayers, onLayerToggle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar 
        activeLayers={activeLayers} 
        onLayerToggle={onLayerToggle}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sx={{
          width: 240,
          flexShrink: 0,
          backgroundColor: '#262626',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          zIndex: 1200
        }}
      />
      <Box sx={{ 
        flexGrow: 1, 
        position: 'relative', 
        height: '100%',
        marginLeft: isSidebarOpen ? 0 : -240,
        transition: 'margin-left 0.3s ease'
      }}>
        <Map 
          activeLayers={activeLayers}
          onLayerToggle={onLayerToggle}
        />
      </Box>
    </Box>
  )
}

MainLayout.propTypes = {
  activeLayers: PropTypes.object.isRequired,
  onLayerToggle: PropTypes.func.isRequired
}

export default MainLayout
