import React from 'react';
import { toast } from 'react-toastify';
import { approve, reject } from '../../services/presentationService';

function handleResult(result, reloadList) {
  if (result.succeeded) {
    reloadList();
  } else {
    result.errors.forEach(error => toast.error(error.message));
  }
}

const PresentationStatusPrompt = ({eventId, id, reloadList, status}) => {
  async function handleApproval() {
    const result = await approve(eventId, id);
    handleResult(result, reloadList);
  }

  async function handleRejection() {
    const result = await reject(eventId, id);
    handleResult(result, reloadList);
  }

  if (status !== 'SUBMITTED') return status.toLowerCase();

  return (
    <div className="d-flex flex-column">
      <button onClick={handleApproval} className="btn btn-success" style={{marginBottom: '.5rem'}}>Approve</button>
      <button onClick={handleRejection} className="btn btn-warning">Reject</button>
    </div>
  );
}

export default PresentationStatusPrompt;
