import format from 'date-format';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ReactTimeAgo from 'react-time-ago';
import { Link, Redirect } from 'react-router-dom';
import { getDetails, update } from '../../services/eventService';
import { getAllLocations } from '../../services/locationService';
import Spinner from '../spinner';
import Input from '../../common/input';
import TextArea from '../../common/textArea';
import Select from '../../common/select';

import './eventDetails.css';

const EventDetails = props => {
  const [event, setEvent] = useState({});
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(2);
  const [submission, setSubmission] = useState(null);
  const [posting, setPosting] = useState(false);
  const [isMissing, setIsMissing] = useState(false);
  const formEl = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      id: props.match.params.id,
      form: new FormData(formEl.current),
    };
    setSubmission(data);
  }

  useEffect(() => {
    async function createEvent(data) {
      if (data === null) return;
      setPosting(true);
      const result = await update(data.id, data.form);
      if (result.succeeded) {
        setEvent(result.event);
        toast.success('Successfully updated.');
      } else {
        result.errors.forEach(error => toast.error(error.message));
      }
      setPosting(false);
    }
    createEvent(submission);
  }, [submission])

  useEffect(() => {
    async function getEvent(id) {
      const result = await getDetails(id);
      if (result.succeeded) {
        setEvent(result.event);
      } else {
        result.errors.forEach(error => toast.error(error.message));
        setIsMissing(true);
      }
      setIsLoading(i => i - 1);
    };
    async function getLocations() {
      const result = await getAllLocations();
      if (result.succeeded) {
        setLocations(result.locations.map(x => { x._id = x.id; return x; }));
      } else {
        result.errors.forEach(error => toast.error(error.message));
      }
      setIsLoading(i => i - 1);
    }
    setSubmission(null);
    getLocations();
    getEvent(props.match.params.id);
  }, [props.match.params.id]);

  return isLoading > 0 ?
    <div className="text-center"><Spinner /></div> :
    isMissing ?
      <Redirect to="/events" /> :
      (
        <section className="container">
          <header className="event-header">
            <div className="d-flex">
              <Link style={{ paddingLeft: 0 }} className="nav-link text-uppercase oswald-semibold" to="/events">Back to events</Link>
              <div className="flex-grow-1 d-flex justify-content-end">
                <Link className="nav-link text-uppercase oswald-semibold" to={`/events/${props.match.params.id}/attendees`}>Attendees</Link>
                <Link className="nav-link text-uppercase oswald-semibold" to={`/events/${props.match.params.id}/presentations`}>Presentations</Link>
                <Link className="nav-link text-uppercase oswald-semibold" to={`/events/${props.match.params.id}/badges`}>Badges</Link>
              </div>
            </div>
            <h1>{event.name}</h1>
            <div className="form-text">
              Created <ReactTimeAgo date={event.created} />
            </div>
          </header>
          <form ref={formEl} onSubmit={handleSubmit}>
            <Input type="hidden" name="version" defaultValue={event.version} />
            <div className="row">
              <div className="col-sm">
                <Input name="name" label="Event name" defaultValue={event.name} required />
                <div className="row">
                  <div className="col-sm">
                    <Input type="date" label="Starts on" name="from" defaultValue={event.from && format.asString('yyyy-MM-dd', event.from)} />
                  </div>
                  <div className="col-sm">
                    <Input type="date" label="Ends on" name="to" defaultValue={event.to && format.asString('yyyy-MM-dd', event.to)} />
                  </div>
                </div>
                <Select defaultValue={event.location.id} name="locationId" options={locations} label="Locations" required />
                <div className="row">
                  <div className="col-sm">
                    <Input type="number" step="1" name="maximumNumberOfAttendees" defaultValue={event.maximumNumberOfAttendees} label="Max # attendees" required />
                  </div>
                  <div className="col-sm">
                    <Input type="number" step="1" name="numberOfPresentations" defaultValue={event.numberOfPresentations} label="# presentations" required />
                  </div>
                </div>
              </div>
              <div className="col-sm align-items-stretch d-flex">
                <TextArea groupClasses="d-flex flex-column flex-grow-1" inputClasses="flex-grow-1 min-height-8rem" name="description" label="Description" defaultValue={event.description} required />
              </div>
            </div>
            <div className="text-right">
              <button className="btn btn-primary" disabled={posting}>Update event</button>
            </div>
          </form>
        </section>
      );
};

export default EventDetails;
