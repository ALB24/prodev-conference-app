import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Input from '../../common/input';

const NewLocationForm = ({ show, hideForm, createLocation }) => {
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
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [maximumVendorCount, setMaximumVendorCount] = useState('');
  const [roomCount, setRoomCount] = useState('');
  const change = func => e => func(e.target.value);
  const cl = async e => {
    e.preventDefault();
    createLocation(name, city, state, maximumVendorCount, roomCount);
  };

  useEffect(() => {
    setName('');
    setCity('');
    setState('');
    setMaximumVendorCount('');
    setRoomCount('');
  }, [show]);

  return (
    <>
      <div className={backdrop} style={backdropStyle}></div>
      <div className={modal} tabIndex="-1" aria-modal="true" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create a new location</h5>
              <button type="button" className="btn-close" onClick={hideForm}></button>
            </div>
            <div className="modal-body">
              <form id="new-location-form" onSubmit={cl}>
                <Input label="Location name" value={name} onChange={change(setName)} name="name" placeholder="Big Conference Center" maxLength="100" minLength="1" required />
                <Input label="City" value={city} onChange={change(setCity)} name="city" placeholder="Anywhere" maxLength="100" minLength="1" required />
                <Input label="State" value={state} onChange={change(setState)} name="name" placeholder="OE" maxLength="100" minLength="1" required />
                <Input type="number" step="1" label="Maximum number of vendor" value={maximumVendorCount} onChange={change(setMaximumVendorCount)} name="maximumVendorCount" placeholder="40" required />
                <Input type="number" step="1" label="Number or rooms" value={roomCount} onChange={change(setRoomCount)} name="roomCount" placeholder="50" required />
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={hideForm}>Cancel</button>
              <button type="submit" form="new-location-form" className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewLocationForm;
