import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { CreateEventView } from 'src/sections/events/view/create-event-view';

export default function CreateEventPage() {
  return (
    <>
      <Helmet>
        <title>{`Create Event - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreateEventView />
    </>
  );
}