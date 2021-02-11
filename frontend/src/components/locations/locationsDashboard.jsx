import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import LocationsTable from "./locationsTable";
import { createLocation, getAllLocations } from "../../services/locationService";
import NewLocationForm from './newLocationForm';
import { withAuthorization } from '../../services/authService';
import Spinner from '../spinner';
import { toast } from 'react-toastify';

class LocationsDashboard extends Component {

  constructor(params) {
    super(params);
    this.state = { loading: true, locations: [], errors: [], showForm: false, sortColumn: { path: "name", order: "asc" }, };
  }

  async componentDidMount() {
    await this.loadLocations();
  }

  async loadLocations() {
    const result = await getAllLocations();
    if (result.succeeded) {
      this.setState({ locations: result.locations })
    } else {
      result.errors.forEach(error => toast.error(error.message));
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

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
    const locations = [...this.state.locations];
    const { order, path } = sortColumn;
    locations.sort((left, right) => {
      const l = left[path];
      const r = right[path];
      if (l === r) return 0;
      
      if (order === 'asc' && l < r) return -1;
      else if (order === 'asc') return 1;
  
      if (order === 'desc' && l < r) return 1;
      else return -1;
    });
    this.setState({ locations });
  };

  create = async (name, city, state, maximumVendorCount, roomCount) => {
    const result = await createLocation(name, city, state, maximumVendorCount, roomCount);
    if (result.succeeded) {
      this.hideForm();
      this.setState({ loading: true });
      await this.loadLocations();
    } else {
      result.errors.forEach(error => toast.error(error.message));
    }
  };

  render() {
    if (!this.props.auth.jwt) {
      return <Redirect to="/login" />;
    }

    if (this.state.loading) {
      return (
        <div className="text-center">
          <Spinner />
        </div>
      );
    }

    if (this.state.locations.length === 0) {
      return (
        <>
          <div className="text-center">
            <h2>You haven't added any locations yet.</h2>
            <button onClick={this.showForm} className="btn btn-info">Create one now</button>
          </div>
          <NewLocationForm show={this.state.showForm} hideForm={this.hideForm} createLocation={this.create} />
        </>
      );
    }
    return (
      <div>
        <div className="container text-right">
          <button onClick={this.showForm} className="btn btn-info">Create one now</button>
        </div>
        <NewLocationForm show={this.state.showForm} hideForm={this.hideForm} createLocation={this.create} />
        <div className="container-fluid mb-5 pb-5 pt-5 gallery-container">
          <div className="row d-flex">
            <LocationsTable
              locations={this.state.locations}
              sortColumn={this.state.sortColumn}
              onSort={this.handleSort}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withAuthorization(LocationsDashboard);
