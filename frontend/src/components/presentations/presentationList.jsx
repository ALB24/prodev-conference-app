import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import NewPresentationForm from './newPresentationForm';
import Spinner from '../spinner';
import { getAllForEvent } from '../../services/presentationService';
import PresentationsTable from './presentationsTable';
import { AuthorizedPage } from '../../services/authService';

const PresentationFormGroup = ({ eventId, reloadList }) => {
  const [show, setShowForm] = useState(false);
  const showForm = () => setShowForm(true);
  const hideForm = () => setShowForm(false);

  return (
    <>
      <div className="text-right" style={{ margin: '0 1rem 1rem 0' }}>
        <button type="button" className="btn btn-secondary" onClick={showForm}>Add a presentation</button>
      </div>
      <NewPresentationForm eventId={eventId} show={show} hideForm={hideForm} reloadList={reloadList} />
    </>
  );
};

const PresentationList = props => {
  const { eventId } = props.match.params;
  const [reload, setReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [presentations, setPresentations] = useState([]);
  const [show, setShow] = useState(['SUBMITTED']);
  const reloadList = () => setReload(Math.random());

  const toggle = status => e => {
    const newShow = [...show];
    if (show.includes(status)) {
      newShow.splice(show.indexOf(status), 1);
    } else {
      newShow.push(status);
    }
    setShow(newShow);
  }

  useEffect(() => {
    async function getPresentations() {
      const result = await getAllForEvent(eventId);
      if (result.succeeded) {
        setPresentations(result.presentations);
      } else {
        result.errors.forEach(error => toast.error(error.message));
      }
      setIsLoading(false);
    }
    getPresentations();
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
            <PresentationFormGroup eventId={eventId} reloadList={reloadList} />
            { presentations.length === 0 ?
              <h2 className="text-center">You don't have any presentations. Yet.</h2> :
              (
                <>
                  <div className="container">
                    <div className="form-check form-check-inline">
                      Filters:
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" id="S" checked={show.includes('SUBMITTED')} onChange={toggle('SUBMITTED')} />
                      <label className="form-check-label" htmlFor="S">Submitted</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" id="A" checked={show.includes('APPROVED')} onChange={toggle('APPROVED')} />
                      <label className="form-check-label" htmlFor="A">Approved</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" id="R" checked={show.includes('REJECTED')} onChange={toggle('REJECTED')} />
                      <label className="form-check-label" htmlFor="R">Rejected</label>
                    </div>
                  </div>
                  <PresentationsTable presentations={presentations.filter(x => show.includes(x.status))} reloadList={reloadList} eventId={eventId} />
                </>
              )
            }
          </>
        )
      }
    </AuthorizedPage>
  );
};

export default PresentationList;
