import {
    Card,
    CardContent,
    Typography,
    Box,
    CardActionArea,
    Chip,
    Stack,
    Button,
  } from '@mui/material';
  import { fDateTime } from 'src/utils/format-time';
  import { useNavigate } from 'react-router-dom';
  
  type EventCardProps = {
    event: {
      id: number;
      name: string;
      date: string;
      location: string;
      description: string;
      capacity: number;
      participantCount?: number;
    };
    onClick: () => void;
  };
  
  export function EventCard({ event, onClick }: EventCardProps) {
    const navigate = useNavigate();
  
    return (
      <Card sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.12)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
        }
      }}>
        <CardActionArea onClick={onClick}>
          <CardContent sx={{ pb: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h6" 
              noWrap 
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
                mb: 1
              }}
            >
              {event.name}
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 2, height: '100%' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip 
                  label={fDateTime(event.date)} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{
                    borderRadius: '16px',
                    '& .MuiChip-label': {
                      px: 2
                    }
                  }}
                />
              </Box>
  
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5 
                }} 
                noWrap
              >
                📍 {event.location}
              </Typography>
  
              <Typography variant="body2" color="text.secondary" sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                height: '3em',
                mb: 'auto'
              }}>
                {event.description}
              </Typography>
  
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center"
                sx={{ 
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  mt: 'auto'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Capacity: {event.capacity}
                </Typography>
                {event.participantCount !== undefined && (
                  <Typography variant="caption" color="text.secondary">
                    Joined: {event.participantCount}
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }