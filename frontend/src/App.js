import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import Main from "./components/main";
import Login from "./components/login";
import NavBar from "./components/nav-bar/navBar";
import Logout from "./components/logOut";
import Events from "./components/events/events";
import EventDetails from "./components/events/eventDetails";
import LocationsDashboard from "./components/locations/locationsDashboard";
import Accounts from "./components/accounts";
import PresentationList from "./components/presentations/presentationList";
import BadgesList from './components/badges/badgesList';
import AttendeeList from './components/attendees/attendeesList';

import auth, { AuthorizationContextProvider } from "./services/authService";

import 'font-awesome/css/font-awesome.min.css';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

TimeAgo.addLocale(en);

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    return (
      <BrowserRouter>
        <AuthorizationContextProvider>
          <NavBar />
          <main className="App-workspace">
            <Switch>
              <Route path="/main" component={Main} />
              <Route exact={true} path="/events" component={Events} />
              <Route exact={true} path="/events/:id" component={EventDetails} />
              <Route exact={true} path="/events/:eventId/presentations" component={PresentationList} />
              <Route exact={true} path="/events/:eventId/badges" component={BadgesList} />
              <Route exact={true} path="/events/:eventId/attendees" component={AttendeeList} />
              <Route path="/locations" component={LocationsDashboard} />
              <Route path="/accounts" component={Accounts} />
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <Route render={() => <Redirect to="/login" />} />
            </Switch>
            <ToastContainer />
          </main>
        </AuthorizationContextProvider>
      </BrowserRouter>
    );
  }
}

export default App;
