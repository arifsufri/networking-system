import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ParticipantsView } from 'src/sections/participants/view/participants-view';

export default function ParticipantsPage() {
  return (
    <>
      <Helmet>
        <title>{`Participants - ${CONFIG.appName}`}</title>
      </Helmet>

      <ParticipantsView />
    </>
  );
} 