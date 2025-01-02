import React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';

const TopButtons = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
        display: 'flex',
        gap: 1
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="small"
        sx={{
          bgcolor: '#fff',
          color: '#333',
          '&:hover': { bgcolor: '#f5f5f5' },
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 1
        }}
      >
        Add Data
      </Button>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        size="small"
        sx={{
          bgcolor: '#fff',
          color: '#333',
          '&:hover': { bgcolor: '#f5f5f5' },
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 1
        }}
      >
        Export
      </Button>
      <Button
        variant="contained"
        startIcon={<ShareIcon />}
        size="small"
        sx={{
          bgcolor: '#fff',
          color: '#333',
          '&:hover': { bgcolor: '#f5f5f5' },
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 1
        }}
      >
        Share
      </Button>
      <Button
        variant="contained"
        startIcon={<SettingsIcon />}
        size="small"
        sx={{
          bgcolor: '#fff',
          color: '#333',
          '&:hover': { bgcolor: '#f5f5f5' },
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 1
        }}
      >
        Settings
      </Button>
    </Box>
  );
};

export default TopButtons; 