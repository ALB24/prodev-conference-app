import React from 'react';
import { NavLink } from 'react-router-dom';

const LoggedInNav = () => (
  <>
    <li className="nav-item d-inline-flex align-items-center justify-content-end">
      <NavLink className="nav-link text-uppercase" to="/events">
        Events
      </NavLink>
    </li>
    <li className="nav-item d-inline-flex align-items-center justify-content-end">
      <NavLink className="nav-link d-inline text-uppercase" to="/locations">
        Locations
      </NavLink>
    </li>
      <li className="nav-item d-inline-flex align-items-center justify-content-end">
      <NavLink className="nav-link d-inline text-uppercase" to="/logout">
      Logout
      </NavLink>
    </li>
  </>
);

export default LoggedInNav;
