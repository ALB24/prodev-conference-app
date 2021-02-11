import React from "react";
import { withRouter, Link } from 'react-router-dom';
import NewEventForm from './newEventForm';

const EventsList = ({ events, show, showForm, hideForm }) => (
  <>
    <div className="text-right" style={{margin: '0 1rem 1rem 0'}}>
      <button type="button" className="btn btn-secondary" onClick={showForm}>Add another event</button>
    </div>
    <NewEventForm show={show} hideForm={hideForm} />
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="description">Description</th>
        </tr>
      </thead>
      <tbody>
        { events.map(x => (
          <tr key={x.id}>
            <td>
              <Link to={`/events/${x.id}`}>{x.name}</Link>
            </td>
            <td>{x.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

export default withRouter(EventsList);
