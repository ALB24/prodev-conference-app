import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../images/logo.png";
import { withAuthorization } from '../../services/authService';
import LoggedInNav from './loggedInNav';
import LoggedOutNav from './loggedOutNav';

import './navBar.css';

const NavBar = ({auth}) => {
  return (
    <React.Fragment>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white-transparent fixed-top"
        id="main-nav"
      >
        <div className="container-fluid mr-xl-5 pr-xl-5">
          <NavLink className="nav-item nav-link eye navbar-brand d-flex" to="/events">
            <img className="" src={logo} alt="graphic design" />
            <div style={{marginLeft: '1rem' }}>Conference GO!</div>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarToggler"
            aria-controls="navbarToggler"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarToggler"
          >
            <ul className="navbar-nav d-flex jmr-auto mt-2 mt-lg-0 oswald-semibold main-nav">
              { auth.jwt ?
                <LoggedInNav /> :
                <LoggedOutNav />
              }
            </ul>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default withAuthorization(NavBar);
