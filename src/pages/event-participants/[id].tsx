import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { fDateTime } from 'src/utils/format-time';

type Participant = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function EventParticipantsPage() {
  const { id } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [eventDetails, setEventDetails] = useState<{
    name: string;
    date: string;
    location: string;
  } | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/events/${id}/participants`);
        const data = await response.json();
        setParticipants(data.participants);
        setEventDetails(data.event);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    if (id) {
      fetchParticipants();
    }
  }, [id]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        {eventDetails && (
          <>
            <Typography variant="h4" gutterBottom>
              {eventDetails.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {fDateTime(eventDetails.date)} at {eventDetails.location}
            </Typography>
          </>
        )}
      </Box>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.role}</TableCell>
                  <TableCell>{fDateTime(participant.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </DashboardContent>
  );
} 