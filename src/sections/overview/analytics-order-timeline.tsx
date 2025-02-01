import type { CardProps } from '@mui/material/Card';
import type { TimelineItemProps } from '@mui/lab/TimelineItem';

import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Box, Stack } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    type: string;
    title: string;
    time: string | number | null;
  }[];
};

export function AnalyticsOrderTimeline({ title, subheader, list, ...other }: Props) {
  // Sort the list to show latest first
  const sortedList = [...list].sort((a, b) => {
    const dateA = new Date(a.time || 0).getTime();
    const dateB = new Date(b.time || 0).getTime();
    return dateB - dateA;
  });

  return (
    <Card {...other}>
      <CardHeader 
        title={title} 
        subheader={subheader}
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: '1.125rem',
            fontWeight: 'bold',
          }
        }}
      />

      <Box sx={{ position: 'relative' }}>
        {/* Latest indicator */}
        <Typography
          variant="caption"
          sx={{
            top: 0,
            right: 24,
            position: 'absolute',
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          Oldest
        </Typography>

        <Timeline
          sx={{
            m: 0,
            p: 3,
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {sortedList.map((item, index) => (
            <Item 
              key={item.id} 
              item={item} 
              lastItem={index === sortedList.length - 1} 
            />
          ))}
        </Timeline>

        {/* Oldest indicator */}
        <Typography
          variant="caption"
          sx={{
            bottom: 16,
            right: 24,
            position: 'absolute',
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          Latest
        </Typography>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = TimelineItemProps & {
  lastItem: boolean;
  item: Props['list'][number];
};

function Item({ item, lastItem, ...other }: ItemProps) {
  const getTimelineColor = (type: string) => {
    switch (type) {
      case 'event_created':
        return 'primary';
      case 'participant_joined':
        return 'success';
      case 'event_updated':
        return 'info';
      case 'event_cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot 
          color={getTimelineColor(item.type)} 
          sx={{
            boxShadow: (theme) => `0 0 0 3px ${theme.palette.background.paper}`,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        />
        {!lastItem && <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Box sx={{ 
          p: 1.5, 
          bgcolor: 'background.neutral',
          borderRadius: 1,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.shadows[2],
          }
        }}>
          <Typography variant="subtitle2">{item.title}</Typography>
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
}
