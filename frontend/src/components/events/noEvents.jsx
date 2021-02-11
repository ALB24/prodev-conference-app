import React from 'react';
import NewEventForm from './newEventForm';

const NoEvents = ({show, showForm, hideForm}) => (
  <>
    <div className="text-center">
      <h2>You haven't scheduled any events.</h2>
      <button className="btn btn-info" onClick={showForm}>Create one now</button>
    </div>
    <NewEventForm show={show} hideForm={hideForm} />
  </>
);

export default NoEvents;
