import { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

interface User {
  id: string;
  name: string;
  email: string;
  role1: string;
  role2: string;
  createdAt: string;
}

interface TimelineItem {
  id: string;
  title: string;
  type: 'event_created' | 'participant_joined' | 'event_updated' | 'event_cancelled';
  time: string;
  eventDate?: string;
}

export function OverviewAnalyticsView() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [userGrowth, setUserGrowth] = useState(0);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [eventGrowth, setEventGrowth] = useState(0);
  const [monthlyEvents, setMonthlyEvents] = useState<number[]>(new Array(8).fill(0));
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [participantGrowth, setParticipantGrowth] = useState(0);
  const [monthlyParticipants, setMonthlyParticipants] = useState<number[]>(new Array(8).fill(0));
  const [todayEvents, setTodayEvents] = useState(0);
  const [todayEventGrowth, setTodayEventGrowth] = useState(0);
  const [dailyEvents, setDailyEvents] = useState<number[]>(new Array(8).fill(0));
  const [topEvent, setTopEvent] = useState<{ 
    name: string; 
    participantCount: number;
    eventId: number;
  } | null>(null);
  const [topEventGrowth, setTopEventGrowth] = useState(0);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [recentEvents, setRecentEvents] = useState<{
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
  }[]>([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        console.log('Current user from localStorage:', currentUser);
        
        if (!currentUser) {
          throw new Error('Not authenticated');
        }

        const userData = JSON.parse(currentUser);
        const { id, role2 } = userData;
        console.log('User data:', { id, role2 });

        const response = await fetch('/api/users', {
          headers: {
            'Content-Type': 'application/json',
            'user-id': id.toString(),
            'user-role': role2,
          },
        });

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const users = await response.json();
        console.log('Fetched users:', users);
        
        // Calculate total users
        setTotalUsers(users.length);

        // Calculate user growth (comparing with previous month)
        const currentMonth = new Date().getMonth();
        const currentYearUsers = users.filter((user: User) => 
          new Date(user.createdAt).getMonth() === currentMonth
        ).length;
        const prevMonthUsers = users.filter((user: User) => 
          new Date(user.createdAt).getMonth() === (currentMonth - 1)
        ).length;

        console.log('Monthly stats:', {
          currentMonth,
          currentYearUsers,
          prevMonthUsers
        });

        const growth = prevMonthUsers ? 
          ((currentYearUsers - prevMonthUsers) / prevMonthUsers) * 100 : 
          0;
        setUserGrowth(Number(growth.toFixed(1)));

        // Get monthly registration data
        const monthlyRegistrations = new Array(8).fill(0);
        users.forEach((user: User) => {
          const month = new Date(user.createdAt).getMonth();
          if (month <= currentMonth && month > currentMonth - 8) {
            monthlyRegistrations[7 - (currentMonth - month)] += 1;
          }
        });
        setMonthlyData(monthlyRegistrations);
        console.log('Monthly registrations:', monthlyRegistrations);

      } catch (error) {
        console.error('Error in fetchUserStats:', error);
        setTotalUsers(0);
        setUserGrowth(0);
        setMonthlyData(new Array(8).fill(0));
      }
    };

    fetchUserStats();
  }, []);

  useEffect(() => {
    const fetchEventStats = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();
        
        // Calculate total events
        setTotalEvents(events.length);

        // Calculate event growth (comparing with previous month)
        const currentMonth = new Date().getMonth();
        const currentMonthEvents = events.filter(
          (event: { date: string }) => new Date(event.date).getMonth() === currentMonth
        ).length;
        
        const prevMonthEvents = events.filter(
          (event: { date: string }) => new Date(event.date).getMonth() === (currentMonth - 1)
        ).length;

        const growth = prevMonthEvents ? 
          ((currentMonthEvents - prevMonthEvents) / prevMonthEvents) * 100 : 
          0;
        setEventGrowth(Number(growth.toFixed(1)));

        // Get monthly event data
        const monthlyEventData = new Array(8).fill(0);
        events.forEach((event: { date: string }) => {
          const month = new Date(event.date).getMonth();
          if (month <= currentMonth && month > currentMonth - 8) {
            monthlyEventData[7 - (currentMonth - month)] += 1;
          }
        });
        setMonthlyEvents(monthlyEventData);
      } catch (error) {
        console.error('Error fetching event stats:', error);
      }
    };

    fetchEventStats();
  }, []);

  useEffect(() => {
    const fetchParticipantStats = async () => {
      try {
        const response = await fetch('/api/participants');
        if (!response.ok) throw new Error('Failed to fetch participants');
        const participants = await response.json();
        
        setTotalParticipants(participants.length);
        
        const currentMonth = new Date().getMonth();
        const currentMonthParticipants = participants.filter(
          (participant: { createdAt: string }) => 
            new Date(participant.createdAt).getMonth() === currentMonth
        ).length;
        
        const prevMonthParticipants = participants.filter(
          (participant: { createdAt: string }) => 
            new Date(participant.createdAt).getMonth() === (currentMonth - 1)
        ).length;

        const growth = prevMonthParticipants ? 
          ((currentMonthParticipants - prevMonthParticipants) / prevMonthParticipants) * 100 : 
          0;
        setParticipantGrowth(Number(growth.toFixed(1)));

        const participantMonthlyData = new Array(8).fill(0);
        participants.forEach((participant: { createdAt: string }) => {
          const month = new Date(participant.createdAt).getMonth();
          if (month <= currentMonth && month > currentMonth - 8) {
            participantMonthlyData[7 - (currentMonth - month)] += 1;
          }
        });
        setMonthlyParticipants(participantMonthlyData);
      } catch (error) {
        console.error('Error fetching participant stats:', error);
      }
    };

    fetchParticipantStats();
  }, []);

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();
        
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Count today's events
        const todayCount = events.filter((event: { date: string }) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        }).length;
        
        setTodayEvents(todayCount);

        // Calculate growth compared to yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayCount = events.filter((event: { date: string }) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === yesterday.getTime();
        }).length;

        const growth = yesterdayCount ? 
          ((todayCount - yesterdayCount) / yesterdayCount) * 100 : 
          0;
        setTodayEventGrowth(Number(growth.toFixed(1)));

        // Get daily data for the past 8 days
        const dailyData = new Array(8).fill(0);
        Array.from({ length: 8 }).forEach((_, index) => {
          const date = new Date(today);
          date.setDate(date.getDate() - index);
          dailyData[7 - index] = events.filter((event: { date: string }) => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate.getTime() === date.getTime();
          }).length;
        });
        setDailyEvents(dailyData);
      } catch (error) {
        console.error('Error fetching today events:', error);
      }
    };

    fetchTodayEvents();
  }, []);

  useEffect(() => {
    const fetchTopEvent = async () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          throw new Error('Not authenticated');
        }

        const { id } = JSON.parse(currentUser);
        const response = await fetch(`${import.meta.env.VITE_HOST_API}/events`, {
          headers: {
            'Content-Type': 'application/json',
            'user-id': id.toString(),
          },
        });

        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();
        
        // Sort events by participant count
        const sortedEvents = events.sort((a: any, b: any) => 
          (b.participantCount || 0) - (a.participantCount || 0)
        );

        if (sortedEvents.length > 0) {
          const mostPopular = sortedEvents[0];
          setTopEvent({
            name: mostPopular.name,
            participantCount: mostPopular.participantCount || 0,
            eventId: mostPopular.id
          });

          // Calculate growth compared to second most popular
          const secondHighest = sortedEvents[1]?.participantCount || 0;
          const growth = secondHighest ? 
            ((mostPopular.participantCount - secondHighest) / secondHighest) * 100 : 
            0;
          setTopEventGrowth(Number(growth.toFixed(1)));
        }
      } catch (error) {
        console.error('Error fetching top event:', error);
      }
    };

    fetchTopEvent();
  }, []);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        // Fetch only events, sorted by createdAt in descending order
        const eventsResponse = await fetch('/api/events?sort=createdAt&order=desc&limit=5');
        const events = await eventsResponse.json();
        
        // Format the events data
        const timelineData: TimelineItem[] = events.map((event: any) => ({
          id: `event-${event.id}`,
          title: `${event.name}`,
          type: 'event_created',
          time: event.createdAt,
        }));
        
        setTimelineItems(timelineData);
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        setTimelineItems([]);
      }
    };

    fetchTimelineData();
  }, []);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=5&sort=date');
        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();
        
        // Filter out past events
        const now = new Date();
        const upcomingEvents = events.filter((event: any) => {
          const eventDate = new Date(event.date);
          return eventDate >= now;
        });
        
        setRecentEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching recent events:', error);
        setRecentEvents([]);
      }
    };

    fetchRecentEvents();
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Available Events"
            percent={eventGrowth}
            total={totalEvents}
            icon={
              <EventAvailableIcon 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  color: 'primary.main',
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }} 
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: monthlyEvents,
            }}
            sx={{ height: '100%', minHeight: 180 }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Registered Users"
            percent={userGrowth}
            total={totalUsers}
            color="secondary"
            icon={
              <PeopleAltIcon 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  color: 'secondary.main',
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }} 
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: monthlyData,
            }}
            sx={{ height: '100%', minHeight: 180 }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Event Participants"
            percent={participantGrowth}
            total={totalParticipants}
            color="warning"
            icon={
              <GroupAddIcon 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  color: 'warning.main',
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }} 
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: monthlyParticipants,
            }}
            sx={{ height: '100%', minHeight: 180 }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews 
            title="Upcoming Events" 
            list={recentEvents.map(event => ({
              id: event.id.toString(),
              title: event.name,
              description: event.description || 'No description available',
              postedAt: event.date,
              location: event.location,
              coverUrl: '/assets/images/event-default.jpg',
              totalViews: 0,
              totalShares: 0,
              totalComments: 0,
              totalFavorites: 0,
              author: {
                name: 'Event Organizer',
                avatarUrl: '/assets/images/avatar/avatar_1.jpg',
              }
            }))} 
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline 
            title="Recent Activities" 
            list={timelineItems} 
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}

        
      </Grid>
    </DashboardContent>
  );
}
