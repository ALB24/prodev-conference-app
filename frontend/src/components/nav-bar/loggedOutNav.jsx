import React from 'react';
import { NavLink } from 'react-router-dom';

const LoggedOutNav = () => (
  <>
    <li className="nav-item d-inline-flex align-items-center justify-content-end">
      <NavLink className="nav-link d-inline text-uppercase" to="/accounts">
        Register
      </NavLink>
    </li>

    <li className="nav-item d-inline-flex align-items-center justify-content-end">
      <NavLink className="nav-link d-inline text-uppercase" to="/login">
        Login
      </NavLink>
    </li>
  </>
);

export default LoggedOutNav;
