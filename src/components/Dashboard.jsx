import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Container 
} from '@mui/material'
import ElectricCarIcon from '@mui/icons-material/ElectricCar'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import HomeWorkIcon from '@mui/icons-material/HomeWork'

const places = [
  {
    title: 'EV Charging Stations',
    description: 'Find nearby electric vehicle charging stations and their availability status.',
    icon: <ElectricCarIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400'
  },
  {
    title: 'Solar Installations',
    description: 'Discover properties with solar panel installations and permit information.',
    icon: <SolarPowerIcon sx={{ fontSize: 40, color: '#FDD835' }} />,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400'
  },
  {
    title: 'Property Analytics',
    description: 'Access detailed property information and market analytics.',
    icon: <HomeWorkIcon sx={{ fontSize: 40, color: '#9C27B0' }} />,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400'
  }
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <Box sx={{ 
      minHeight: '100%',
      bgcolor: '#1a1a1a',
      color: '#fff',
      pt: 8,
      pb: 12
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Welcome to Game Changer
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Discover properties, analyze market trends, and make data-driven decisions with our interactive mapping platform.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/map')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
              }
            }}
          >
            Launch Demo
          </Button>
        </Box>

        {/* Places of Interest */}
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          Places of Interest
        </Typography>
        <Grid container spacing={4}>
          {places.map((place) => (
            <Grid item xs={12} md={4} key={place.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={place.image}
                  alt={place.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {place.icon}
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        ml: 1,
                        fontWeight: 600
                      }}
                    >
                      {place.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6
                    }}
                  >
                    {place.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard 