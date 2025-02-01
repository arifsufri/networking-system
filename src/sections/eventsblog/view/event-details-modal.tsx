import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Box,
    IconButton,
  } from '@mui/material';
  import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
  import { fDateTime } from 'src/utils/format-time';
  
  type EventDetailsModalProps = {
    event: {
      id: number;
      name: string;
      date: string;
      location: string;
      description: string;
      capacity: number;
      participantCount?: number;
    } | null;
    open: boolean;
    onClose: () => void;
    onJoin: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isAdmin?: boolean;
  };
  
  export function EventDetailsModal({ 
    event, 
    open, 
    onClose, 
    onJoin, 
    onEdit,
    onDelete,
    isAdmin = false 
  }: EventDetailsModalProps) {
    if (!event) return null;
  
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[24],
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: (theme) => theme.palette.primary.main,
          color: 'white',
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {event.name}
          {isAdmin && (
            <Box>
              <IconButton 
                onClick={onEdit}
                sx={{ color: 'white', mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={onDelete}
                sx={{ color: 'white' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </DialogTitle>
  
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          <Stack spacing={3}>
            <Box sx={{ 
              p: 2, 
              bgcolor: (theme) => theme.palette.background.neutral,
              borderRadius: 1,
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Date & Time
              </Typography>
              <Typography>{fDateTime(event.date)}</Typography>
            </Box>
  
            <Box sx={{ 
              p: 2, 
              bgcolor: (theme) => theme.palette.background.neutral,
              borderRadius: 1,
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Location
              </Typography>
              <Typography>{event.location}</Typography>
            </Box>
  
            <Box sx={{ 
              p: 2, 
              bgcolor: (theme) => theme.palette.background.neutral,
              borderRadius: 1,
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography sx={{ 
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}>
                {event.description}
              </Typography>
            </Box>
  
            <Box sx={{ 
              p: 2, 
              bgcolor: (theme) => theme.palette.background.neutral,
              borderRadius: 1,
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Capacity
              </Typography>
              <Typography>
                {event.participantCount ?? 0} / {event.capacity} participants
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
  
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button 
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
          >
            Close
          </Button>
          <Button 
            onClick={onJoin} 
            variant="contained"
            sx={{ px: 3 }}
          >
            Join Event
          </Button>
        </DialogActions>
      </Dialog>
    );
  }