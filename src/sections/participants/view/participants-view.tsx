import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Stack,
  Avatar,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { fDateTime } from 'src/utils/format-time';
import { PersonOutline, EventAvailable, WorkOutline, EmailOutlined } from '@mui/icons-material';

type Event = {
  id: number;
  name: string;
};

type Participant = {
  id: number;
  name: string;
  email: string;
  role: string;
  eventId: number;
  createdAt: string;
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
  };
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ParticipantsView() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      // Fetch participants
      const participantsResponse = await fetch(`${API_URL}/api/participants`);
      if (!participantsResponse.ok) {
        throw new Error(`Failed to fetch participants: ${participantsResponse.statusText}`);
      }
      const participantsData: Participant[] = await participantsResponse.json();
      
      // Fetch all events
      const eventsResponse = await fetch(`${API_URL}/api/events`);
      if (!eventsResponse.ok) {
        throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
      }
      const eventsData = await eventsResponse.json();
      
      // Format events for the filter dropdown
      const formattedEvents: Event[] = eventsData.map((event: any) => ({
        id: event.id,
        name: event.name
      }));
      
      setEvents(formattedEvents);
      setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setParticipants([]);
    }
  };

  const filteredParticipants = selectedEventId === 'all'
    ? participants
    : participants.filter(p => p.eventId === Number(selectedEventId));

  return (
    <DashboardContent>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonOutline sx={{ color: 'primary.main', width: 32, height: 32 }} />
          <Typography variant="h4">
            Event Participants
          </Typography>
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Filter by Event</InputLabel>
          <Select
            value={selectedEventId}
            label="Filter by Event"
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <MenuItem value="all">All Events</MenuItem>
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Card
          sx={{
            boxShadow: (theme) => theme.customShadows?.card || 'none',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              {filteredParticipants.map((participant) => (
                <Stack
                  key={participant.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.primary.lighter,
                      transform: 'translateX(6px)',
                    },
                  }}
                >
                  <Avatar
                    alt={participant.name}
                    src={`/assets/images/avatar/avatar_${participant.id % 24 + 1}.jpg`}
                    sx={{
                      width: 56,
                      height: 56,
                      border: (theme) => `4px solid ${theme.palette.background.paper}`,
                      boxShadow: (theme) => theme.customShadows?.z8 || 'none',
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PersonOutline sx={{ color: 'primary.main', width: 20 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {participant.name}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <WorkOutline sx={{ color: 'text.secondary', width: 18 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {participant.role}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailOutlined sx={{ color: 'text.secondary', width: 18 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {participant.email}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EventAvailable sx={{ color: 'text.secondary', width: 18 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {participant.event.name} | {fDateTime(participant.event.date)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              ))}

              {filteredParticipants.length === 0 && (
                <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  No participants found
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </DashboardContent>
  );
} 