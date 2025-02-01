import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
};

export function DeleteConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
} 