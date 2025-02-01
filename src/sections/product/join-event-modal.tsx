import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

type JoinEventModalProps = {
  open: boolean;
  onClose: () => void;
  eventId: number;
};

export function JoinEventModal({ open, onClose, eventId }: JoinEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STARTUP',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join event');
      }

      onClose();
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Join Event</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="STARTUP">Startup</MenuItem>
                <MenuItem value="INVESTOR">Investor</MenuItem>
                <MenuItem value="MENTOR">Mentor</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Join Event
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 