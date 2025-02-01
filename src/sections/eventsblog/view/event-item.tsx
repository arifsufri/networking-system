import {
  Box,
  Card,
  Stack,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Label } from 'src/components/label';
import { fDateTime } from 'src/utils/format-time';

export type EventItemProps = {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  capacity: number;
  participantCount: number;
};

type Props = {
  event: EventItemProps;
  onJoinClick: (eventId: number) => void;
};

export function EventItem({ event, onJoinClick }: Props) {
  const isFullyBooked = event.participantCount >= event.capacity;

  return (
    <Card>
      <Box sx={{ p: 3, position: 'relative' }}>
        <Label
          variant="soft"
          color={isFullyBooked ? 'error' : 'success'}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          {isFullyBooked ? 'Full' : 'Open'}
        </Label>

        <Stack spacing={2}>
          <Typography variant="h6">{event.name}</Typography>
          
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Date: {fDateTime(event.date)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Location: {event.location}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Capacity: {event.participantCount}/{event.capacity}
            </Typography>
          </Stack>

          <Typography variant="body2" noWrap>
            {event.description}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            disabled={isFullyBooked}
            onClick={() => onJoinClick(event.id)}
          >
            {isFullyBooked ? 'Fully Booked' : 'Join Event'}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
} 