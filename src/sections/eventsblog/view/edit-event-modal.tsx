import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

type EditEventModalProps = {
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
    description: string;
    capacity: number;
  } | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedEvent: any) => Promise<void>;
};

export function EditEventModal({ event, open, onClose, onSave }: EditEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    capacity: 0,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        description: event.description,
        capacity: event.capacity,
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Event</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Event Date & Time"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
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
            />
            <TextField
              fullWidth
              type="number"
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 