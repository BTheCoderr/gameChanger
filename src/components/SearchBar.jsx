<<<<<<< HEAD
import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box, Autocomplete, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { searchParcels } from '../services/gisService';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    if (!value) return;
    setLoading(true);
    try {
      const results = await searchParcels(value);
      setSuggestions(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        zIndex: 1000,
        borderRadius: 2,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Autocomplete
        freeSolo
        options={suggestions}
        value={searchTerm}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : option.properties.ADDRESS
        }
        loading={loading}
        onInputChange={(event, value) => {
          setSearchTerm(value);
          if (value.length > 2) {
            handleSearch(value);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search address or parcel ID..."
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                padding: '4px 14px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: '1px'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '& input': {
                  fontSize: '14px',
                  color: '#333',
                  '&::placeholder': {
                    color: '#666',
                    opacity: 1
                  }
                }
              }
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {searchTerm && (
                    <IconButton 
                      size="small" 
                      onClick={handleClear}
                      sx={{ color: '#666' }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton 
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Box>
              ),
            }}
          />
        )}
        sx={{
          '& .MuiAutocomplete-listbox': {
            maxHeight: '300px',
            bgcolor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '& li': {
              padding: '8px 16px',
              borderBottom: '1px solid #eee',
              fontSize: '14px',
              color: '#333',
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            },
          },
        }}
      />
    </Paper>
  );
};

export default SearchBar; 
=======
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popper,
  Grow
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { leads, solarPermits, moveIns } from '../services/mapData'

function SearchBar({ onResultSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [results, setResults] = useState([])

  const handleSearch = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    setAnchorEl(event.currentTarget)

    if (value.length < 2) {
      setResults([])
      return
    }

    const searchResults = []
    const term = value.toLowerCase()

    // Search leads
    leads.forEach(lead => {
      const { totalHouseholds, avgIncome, avgHomeValue } = lead.properties
      if (
        totalHouseholds.toString().includes(term) ||
        avgIncome.toLowerCase().includes(term) ||
        avgHomeValue.toLowerCase().includes(term)
      ) {
        searchResults.push({
          ...lead,
          type: 'lead',
          displayText: `Lead: ${avgHomeValue} - ${avgIncome}`
        })
      }
    })

    // Search solar permits
    solarPermits.forEach(permit => {
      const { type, status, date } = permit.properties
      if (
        type.toLowerCase().includes(term) ||
        status.toLowerCase().includes(term) ||
        date.includes(term)
      ) {
        searchResults.push({
          ...permit,
          type: 'permit',
          displayText: `Solar Permit: ${type} - ${status}`
        })
      }
    })

    // Search move-ins
    moveIns.forEach(moveIn => {
      const { propertyType, moveInDate } = moveIn.properties
      if (
        propertyType.toLowerCase().includes(term) ||
        moveInDate.includes(term)
      ) {
        searchResults.push({
          ...moveIn,
          type: 'moveIn',
          displayText: `Move In: ${propertyType} - ${moveInDate}`
        })
      }
    })

    setResults(searchResults.slice(0, 5))
  }

  const handleClear = () => {
    setSearchTerm('')
    setResults([])
  }

  const handleResultClick = (result) => {
    onResultSelect(result)
    setResults([])
    setSearchTerm('')
  }

  const open = Boolean(anchorEl) && results.length > 0

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search leads, permits, or move-ins..."
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{
          backgroundColor: 'white',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
            },
          }
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={3}>
              <List>
                {results.map((result, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleResultClick(result)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemText primary={result.displayText} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}

SearchBar.propTypes = {
  onResultSelect: PropTypes.func.isRequired
}

export default SearchBar 
>>>>>>> 3220ebf9ee2c7374467e4bbb65e8015d3af3c7d4
