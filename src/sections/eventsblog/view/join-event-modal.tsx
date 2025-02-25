import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Snackbar,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type JoinEventModalProps = {
  open: boolean;
  onClose: () => void;
  eventId: number;
  onSuccess?: () => void;
};

export function JoinEventModal({ open, onClose, eventId, onSuccess }: JoinEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STARTUP',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add useEffect to pre-fill email from logged-in user
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const { email } = JSON.parse(currentUser);
      setFormData(prev => ({
        ...prev,
        email,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('Please log in to join events');
      }

      const { email } = JSON.parse(currentUser);
      
      const response = await fetch('http://localhost:3000/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email, // Use email from localStorage instead of form
          eventId: Number(eventId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join event');
      }

      setShowSuccess(true);
      setFormData({
        name: '',
        email,
        role: 'STARTUP',
      });
      
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Error joining event:', err);
      setError(err.message);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(145, 158, 171, 0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          borderBottom: '1px solid rgba(145, 158, 171, 0.12)',
          bgcolor: 'primary.lighter',
          color: 'primary.darker',
          typography: 'h5',
          fontWeight: 600
        }}>
          Join Event
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                select
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              >
                <MenuItem value="STARTUP">Startup</MenuItem>
                <MenuItem value="INVESTOR">Investor</MenuItem>
                <MenuItem value="MENTOR">Mentor</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ 
            px: 3, 
            py: 2,
            borderTop: '1px solid rgba(145, 158, 171, 0.12)',
            bgcolor: 'grey.50'
          }}>
            <Button 
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                boxShadow: '0 8px 16px 0 rgba(0, 171, 85, 0.24)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Join
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          sx={{ 
            width: '100%',
            bgcolor: 'primary.main',
            color: 'common.white',
            '& .MuiAlert-icon': {
              color: 'common.white',
            },
            boxShadow: (theme) => theme.customShadows?.primary || '0 8px 16px 0 rgba(0, 171, 85, 0.24)',
            borderRadius: 2,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            '& .MuiAlert-message': {
              padding: '8px 0',
            },
            animation: 'slideIn 0.5s ease-out',
            '@keyframes slideIn': {
              from: {
                transform: 'translateX(100%)',
                opacity: 0,
              },
              to: {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Successfully Joined!
              </Typography>
              <Typography variant="caption">
                You have been added to the event
              </Typography>
            </Box>
          </Stack>
        </Alert>
      </Snackbar>
    </>
  );
} 