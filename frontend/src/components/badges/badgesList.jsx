import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllForEvent } from '../../services/badgesService';
import { getDetails } from '../../services/eventService';
import { AuthorizedPage } from '../../services/authService';
import Badge from './badge';

const BadgesList = props => {
  const eventId = props.match.params.eventId;
  const [badges, setBadges] = useState([]);
  const [eventName, setEventName] = useState({});

  useEffect(() => {
    async function getEvent() {
      const result = await getDetails(eventId);
      if (result.succeeded) {
        setEventName(result.event.name);
      } else {
        result.errors.forEach(error => toast.error(error.message));
      }
    }
    getEvent();
  }, [eventId]);

  useEffect(() => {
    async function getAll() {
      const result = await getAllForEvent(eventId);
      if (result.succeeded) {
        setBadges(result.badges);
      } else {
        result.errors.forEach(error => toast.error(error.message));
      }
    }
    getAll();
  }, [eventId]);

  return (
    <AuthorizedPage redirectToPath="/login">
      <div className="d-flex" style={{marginBottom: '2rem'}}>
        <div className="flex-grow-1 d-flex">
          <Link className="nav-link text-uppercase oswald-semibold" to={`/events/${eventId}`}>Back to event</Link>
        </div>
      </div>
      <div className="container">
        {badges.map(x => <Badge key={x.qrcode} badge={x} eventName={eventName} />)}
      </div>
    </AuthorizedPage>
  );
};

export default BadgesList;
