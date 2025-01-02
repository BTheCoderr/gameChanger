import PropTypes from 'prop-types'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'

function InfoCard({ data }) {
  if (!data) return null

  // Format currency values
  const formatCurrency = (value) => {
    if (typeof value === 'string' && value.startsWith('$')) return value
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  // Format date values
  const formatDate = (value) => {
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }
    return value
  }

  return (
    <Card sx={{ 
      minWidth: 275, 
      maxWidth: 350,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: 3
    }}>
      <CardContent>
        {Object.entries(data).map(([key, value]) => {
          // Skip internal properties or empty values
          if (key.startsWith('_') || !value) return null
          
          // Format the key for display
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter

          // Format the value based on its type and key
          let formattedValue = value
          if (key.includes('date') || key.includes('Date')) {
            formattedValue = formatDate(value)
          } else if (key.includes('income') || key.includes('value') || key.includes('cost')) {
            formattedValue = formatCurrency(value)
          }

          // Special formatting for status
          if (key === 'status') {
            return (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {formattedKey}
                </Typography>
                <Box>
                  <Chip 
                    label={value}
                    size="small"
                    color={
                      value === 'Approved' ? 'success' :
                      value === 'Pending' ? 'warning' :
                      value === 'Completed' ? 'info' :
                      'default'
                    }
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            )
          }
          
          return (
            <Box key={key} sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formattedKey}
              </Typography>
              <Typography variant="body2">
                {formattedValue.toString()}
              </Typography>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

InfoCard.propTypes = {
  data: PropTypes.object
}

export default InfoCard 