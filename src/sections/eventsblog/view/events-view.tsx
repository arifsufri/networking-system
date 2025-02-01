import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { EventCard } from './event-card';
import { EventDetailsModal } from './event-details-modal';
import { JoinEventModal } from './join-event-modal';
import { EditEventModal } from './edit-event-modal';
import { DeleteConfirmModal } from './delete-confirm-modal';

type Event = {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  capacity: number;
  participantCount?: number;
};

export function EventsView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const userRole = localStorage.getItem('currentUser') 
    ? JSON.parse(localStorage.getItem('currentUser')!).role2 
    : null;
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenDetailsModal(true);
  };

  const handleJoinClick = () => {
    setOpenDetailsModal(false);
    setOpenJoinModal(true);
  };

  const handleJoinSuccess = () => {
    fetchEvents();
  };

  const handleEditClick = () => {
    setOpenDetailsModal(false);
    setOpenEditModal(true);
  };

  const handleDeleteClick = () => {
    setOpenDetailsModal(false);
    setOpenDeleteConfirm(true);
  };

  const handleUpdateEvent = async (updatedEvent: any) => {
    if (!selectedEvent) return;
    
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const { id: userId } = JSON.parse(currentUser);
      
      console.log('Sending update request for event:', selectedEvent.id);
      console.log('Update payload:', {
        name: updatedEvent.name,
        date: new Date(updatedEvent.date).toISOString(),
        location: updatedEvent.location,
        description: updatedEvent.description,
        capacity: parseInt(updatedEvent.capacity, 10),
      });

      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId.toString(),
        },
        body: JSON.stringify({
          name: updatedEvent.name,
          date: new Date(updatedEvent.date).toISOString(),
          location: updatedEvent.location,
          description: updatedEvent.description,
          capacity: parseInt(updatedEvent.capacity, 10),
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          throw new Error(errorData.message || 'Failed to update event');
        } else {
          const text = await response.text();
          console.log('Response text:', text);
          throw new Error(`Server error: ${response.status}`);
        }
      }

      await fetchEvents();
      setOpenEditModal(false);
    } catch (error) {
      console.error('Update error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update event');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const { id: userId } = JSON.parse(currentUser);

      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId.toString(),
        },
      });

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }

      setOpenDeleteConfirm(false);
      fetchEvents();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="mdi:calendar-month" width={32} />
          Events
        </Typography>
        {/* {userRole === 'ADMIN' && (
          <Button
            component={RouterLink}
            to="/create-event"
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Event
          </Button>
        )} */}
      </Box>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.id} item xs={12} sm={6} md={4}>
            <EventCard 
              event={event} 
              onClick={() => handleEventClick(event)}
            />
          </Grid>
        ))}
      </Grid>

      <EventDetailsModal
        event={selectedEvent}
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        onJoin={handleJoinClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isAdmin={isAdmin}
      />

      <EditEventModal
        event={selectedEvent}
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSave={handleUpdateEvent}
      />

      <DeleteConfirmModal
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${selectedEvent?.name}"? This action cannot be undone.`}
      />

      {selectedEvent && (
        <JoinEventModal
          open={openJoinModal}
          onClose={() => {
            setOpenJoinModal(false);
            setSelectedEvent(null);
          }}
          eventId={selectedEvent.id}
          onSuccess={handleJoinSuccess}
        />
      )}
    </DashboardContent>
  );
}