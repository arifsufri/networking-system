import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { EventsView } from 'src/sections/eventsblog/view';

export default function EventsPage() {
  return (
    <>
      <Helmet>
        <title>{`Events - ${CONFIG.appName}`}</title>
      </Helmet>

      <EventsView />
    </>
  );
} 