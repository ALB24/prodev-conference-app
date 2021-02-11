import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import Input from '../../common/input';
import TextArea from '../../common/textArea';
import Select from '../../common/select';
import { getAllLocations } from '../../services/locationService';
import { create } from '../../services/eventService';

const createEvent = (name, desc, locId, hideForm) => async e => {
  e.preventDefault();
  const result = await create(name, desc, locId);
  if (result.succeeded) {
    hideForm();
  } else {
    result.errors.forEach(error => toast.error(error.message));
  }
};

const NewEventForm = ({show, hideForm}) => {
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

  const [desc, setDesc] = useState('');
  const [name, setName] = useState('');
  const [locId, setLocId] = useState(0);
  const [locations, setLocations] = useState([]);
  const change = func => e => func(e.target.value);

  useEffect(() => {
    async function fetchData() {
      const result = await getAllLocations();
      if (result.succeeded) {
        if (result.locations.length) setLocId(result.locations[0].id);
        setLocations(result.locations.map(x => { x._id = x.id; return x; }));
      }
    }
    fetchData();
  }, []);

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
              <form id="new-event-form" onSubmit={createEvent(name, desc, locId, hideForm)}>
                <Input value={name} onChange={change(setName)} name="name" label="Name" placeholder="Awesome Conference!" maxLength="100" minLength="1" required />
                <TextArea value={desc} onChange={change(setDesc)} name="description" label="Description" placeholder="You can't even imagine how great this will be!" required />
                <Select value={locId} onChange={change(setLocId)} name="location" options={locations} label="Locations" required />
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

export default NewEventForm;
