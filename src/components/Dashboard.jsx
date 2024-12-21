import { Box, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', production: 4000 },
  { month: 'Feb', production: 3000 },
  { month: 'Mar', production: 5000 },
  { month: 'Apr', production: 5780 },
  { month: 'May', production: 6890 },
  { month: 'Jun', production: 7200 },
  { month: 'Jul', production: 7500 },
  { month: 'Aug', production: 7300 },
  { month: 'Sep', production: 6500 },
  { month: 'Oct', production: 5500 },
  { month: 'Nov', production: 4500 },
  { month: 'Dec', production: 3800 },
]

function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Metrics Cards */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
            <CardContent sx={{ color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                Total Properties
              </Typography>
              <Typography variant="h3">
                42
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' }}>
            <CardContent sx={{ color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                Solar Potential
              </Typography>
              <Typography variant="h3">
                78%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #FFA726 30%, #FFB74D 90%)' }}>
            <CardContent sx={{ color: 'white' }}>
              <Typography variant="h6" gutterBottom>
                Average Savings
              </Typography>
              <Typography variant="h3">
                $1,250
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Image Cards */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%', 
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aerial View
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="300"
              image="/aerial-view.jpg"
              alt="Aerial View"
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Solar Analysis
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="300"
              image="/solar-analysis.jpg"
              alt="Solar Analysis"
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Energy Production Forecast
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="production" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
