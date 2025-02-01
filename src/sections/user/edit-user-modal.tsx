import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { UserProps } from './user-table-row';

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
  user: UserProps;
  onSave: (updatedUser: UserProps) => Promise<void>;
};

export function EditUserModal({ open, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<UserProps>(user);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="grid" gap={3}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormControl fullWidth>
              <InputLabel>Primary Role</InputLabel>
              <Select
                name="role1"
                value={formData.role1}
                onChange={handleChange}
                label="Primary Role"
              >
                <MenuItem value="STARTUP">Startup</MenuItem>
                <MenuItem value="INVESTOR">Investor</MenuItem>
                <MenuItem value="MENTOR">Mentor</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Account Type</InputLabel>
              <Select
                name="role2"
                value={formData.role2}
                onChange={handleChange}
                label="Account Type"
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 