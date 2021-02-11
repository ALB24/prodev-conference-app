import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import Input from '../../common/input';
import TextArea from '../../common/textArea';
import { create } from '../../services/presentationService';

const createPresentation = (eventId, email, presenterName, companyName, title, synopsis, hideForm, reloadList) => async e => {
  e.preventDefault();
  const result = await create(eventId, email, presenterName, companyName, title, synopsis);
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

const NewPresentationForm = ({eventId, show, hideForm, reloadList}) => {
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

  const [synopsis, setSynopsis] = useState('');
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [email, setEmail] = useState('');
  const change = func => e => func(e.target.value);

  useEffect(() => {
    setSynopsis('');
    setTitle('');
    setCompanyName('');
    setPresenterName('');
    setEmail('');
  }, [show]);

  return (
    <>
      <div className={backdrop} style={backdropStyle}></div>
      <div className={modal} tabIndex="-1" aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create a new event</h5>
              <button type="button" className="btn-close" onClick={hideForm}></button>
            </div>
            <div className="modal-body">
              <form id="new-event-form" onSubmit={createPresentation(eventId, email, presenterName, companyName, title, synopsis, hideForm, reloadList)}>
                <Input value={presenterName} onChange={change(setPresenterName)} name="presenterName" label="Presenter name" placeholder="Full name" maxLength="100" minLength="1" required />
                <Input type="email" value={email} onChange={change(setEmail)} name="email" label="Presenter email" placeholder="someone@example.com"  maxLength="100" minLength="1" required />
                <Input value={companyName} onChange={change(setCompanyName)} name="companyName" label="Company name" placeholder="ACME LLC" maxLength="100" minLength="1" required />
                <Input value={title} onChange={change(setTitle)} name="name" label="Presentation title" placeholder="Stuff you should know!" maxLength="100" minLength="1" required />
                <TextArea value={synopsis} onChange={change(setSynopsis)} name="synopsis" label="Presentation synopsis" placeholder="You won't believe what you'll learn in this!" required />
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

export default NewPresentationForm;
