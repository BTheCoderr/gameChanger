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