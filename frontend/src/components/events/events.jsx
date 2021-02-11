import React, { Component } from "react";
import Spinner from '../spinner';
import NoEvents from './noEvents';
import EventsList from './eventsList';
import { AuthorizedPage } from '../../services/authService';
import { getAll } from '../../services/eventService';



class Events extends Component {
  constructor(params) {
    super(params);
    this.state = { loading: true, events: [], errors: [], showForm: false };
  }

  async componentDidMount() {
    const result = await getAll();
    if (result.succeeded) {
      this.setState({ events: result.events });
    } else {
      this.setState({ errors: result.errors });
    }
    this.setState({ loading: false });
  }

  showForm = e => {
    e.preventDefault();
    this.setState({ showForm: true });
  }

  hideForm = e => {
    if (e) e.preventDefault();
    this.setState({ showForm: false });
    this.componentDidMount();
  }

  render() {
    return (
      <AuthorizedPage redirectToPath="/login">
        { this.state.loading ? 
          <div className="text-center"><Spinner /></div> :
          ( this.state.events.length === 0 ?
            <NoEvents show={this.state.showForm} showForm={this.showForm} hideForm={this.hideForm} /> :
            <EventsList events={this.state.events} show={this.state.showForm} showForm={this.showForm} hideForm={this.hideForm} />
          )
        }
      </AuthorizedPage>
    );
  }
}

export default Events;
