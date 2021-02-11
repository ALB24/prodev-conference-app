import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import Input from '../../common/input';
import TextArea from '../../common/textArea';
import { create } from '../../services/attendeesService';

const createAttendee = (eventId, name, email, companyName, hideForm, reloadList) => async e => {
  e.preventDefault();
  const result = await create(eventId, name, email, companyName);
  if (result.succeeded) {
    hideForm();
    reloadList();
  } else {
    for (let error of result.errors) {
      for (let e of Object.values(error.errors)) {
        toast.error(e.message);
      }
    }
  }
};

const NewAttendeeForm = ({eventId, show, hideForm, reloadList}) => {
  const modal = classNames({
    modal: true,
    fade: true,
    show,
  });
  const backdrop = classNames({
    'modal-backdrop': true,
    fade: true,
    show
  });
  const backdropStyle = { display: show ? 'block' : 'none' };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const change = func => e => func(e.target.value);

  useEffect(() => {
    setName('');
    setCompanyName('');
    setEmail('');
  }, [show]);

  return (
    <>
      <div className={backdrop} style={backdropStyle}></div>
      <div className={modal} tabIndex="-1" aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add an attendee</h5>
              <button type="button" className="btn-close" onClick={hideForm}></button>
            </div>
            <div className="modal-body">
              <form id="new-event-form" onSubmit={createAttendee(eventId, name, email, companyName, hideForm, reloadList)}>
                <Input value={name} onChange={change(setName)} name="name" label="Attendee name" placeholder="Full name" maxLength="100" minLength="1" required />
                <Input type="email" value={email} onChange={change(setEmail)} name="email" label="Attendee email" placeholder="someone@example.com"  maxLength="100" minLength="1" required />
                <Input value={companyName} onChange={change(setCompanyName)} name="companyName" label="Company name" placeholder="ACME LLC" maxLength="100" minLength="1" required />
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={hideForm}>Cancel</button>
              <button type="submit" form="new-event-form" className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAttendeeForm;
