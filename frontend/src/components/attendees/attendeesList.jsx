import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import NewAttendeeForm from './newAttendeeForm';
import Spinner from '../spinner';
import { getAllForEvent } from '../../services/attendeesService';
import AttendeeTable from './attendeesTable';
import { AuthorizedPage } from '../../services/authService';

const AttendeeFormGroup = ({ eventId, reloadList }) => {
  const [show, setShowForm] = useState(false);
  const showForm = () => setShowForm(true);
  const hideForm = () => setShowForm(false);

  return (
    <>
      <div className="text-right" style={{ margin: '0 1rem 1rem 0' }}>
        <button type="button" className="btn btn-secondary" onClick={showForm}>Add an attendee</button>
      </div>
      <NewAttendeeForm eventId={eventId} show={show} hideForm={hideForm} reloadList={reloadList} />
    </>
  );
};

const PresentationList = props => {
  const { eventId } = props.match.params;
  const [reload, setReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const reloadList = () => setReload(Math.random());

  useEffect(() => {
    async function getAttendees() {
      const result = await getAllForEvent(eventId);
      if (result.succeeded) {
        setAttendees(result.attendees);
      } else {
        result.errors.forEach(error => toast.error(error.message));
      }
      setIsLoading(false);
    }
    getAttendees();
  }, [eventId, reload]);

  return (
    <AuthorizedPage redirectToPath="/login">
      <div className="d-flex" style={{marginBottom: '2rem'}}>
        <div className="flex-grow-1 d-flex">
          <Link className="nav-link text-uppercase oswald-semibold" to={`/events/${eventId}`}>Back to event</Link>
        </div>
      </div>
      { isLoading ?
        <div className="text-center"><Spinner /></div> :
        (
          <>
            <AttendeeFormGroup eventId={eventId} reloadList={reloadList} />
            { attendees.length === 0 ?
                <h2 className="text-center">No one's coming, yet.</h2> :
                <AttendeeTable presentations={attendees} reloadList={reloadList} eventId={eventId} />
            }
          </>
        )
      }
    </AuthorizedPage>
  );
};

export default PresentationList;
