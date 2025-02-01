import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// ----------------------------------------------------------------------

const baseNavItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    adminOnly: false,
  },
  {
    title: 'User',
    path: '/user',
    icon: <PersonIcon />,
    adminOnly: true,
  },
  {
    title: 'Create Event',
    path: '/events/create',
    icon: <AddCircleIcon />,
    adminOnly: true,
  },
  {
    title: 'Event',
    path: '/events',
    icon: <EventIcon />,
    adminOnly: false,
  },
  {
    title: 'Participants',
    path: '/participants',
    icon: <GroupIcon />,
    adminOnly: true,
  },
];

export const getNavData = () => {
  const currentUser = localStorage.getItem('currentUser');
  const userRole = currentUser ? JSON.parse(currentUser).role2 : null;
  
  return baseNavItems.filter(item => !item.adminOnly || userRole === 'ADMIN');
};
