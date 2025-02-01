import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  EventNote,
  LocationOn,
  Description,
  Group,
  CalendarMonth,
  Add as AddIcon,
  ArrowBack
} from '@mui/icons-material';

export function CreateEventView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    capacity: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      console.log('Date input value:', formData.date);
      
      if (!formData.date) {
        throw new Error('Date is required');
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date,
          capacity: parseInt(formData.capacity, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <DashboardContent>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 5,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          backgroundClip: 'text',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <EventNote sx={{ fontSize: 35 }} /> Create New Event
      </Typography>

      <Card sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        borderRadius: 2,
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
        width: '100%',
        mx: 'auto'
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack spacing={3} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventNote sx={{ color: '#2196F3' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2196F3',
                }
              }}
            />

            <TextField
              fullWidth
              type="datetime-local"
              label="Event Date & Time"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonth sx={{ color: '#2196F3' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2196F3',
                }
              }}
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ color: '#2196F3' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2196F3',
                }
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description sx={{ color: '#2196F3' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2196F3',
                }
              }}
            />

            <TextField
              fullWidth
              type="number"
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Group sx={{ color: '#2196F3' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2196F3',
                }
              }}
            />

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              justifyContent: 'flex-end',
              mt: 2 
            }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/events')}
                startIcon={<ArrowBack />}
                sx={{
                  borderColor: '#9e9e9e',
                  color: '#9e9e9e',
                  '&:hover': {
                    borderColor: '#757575',
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                  }
                }}
              >
                Create Event
              </Button>
            </Box>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
} 