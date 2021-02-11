import React from "react";
import Form from "../common/form";
import Joi from "joi-browser";
import { Redirect, withRouter } from "react-router-dom";
import { withAuthorization } from '../services/authService';
import { toast } from 'react-toastify';

class RegistrationForm extends Form {
  state = {
    redirect: false,
    data: { email: "", password: "", name: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  };

  doSubmit = async () => {
    const result = await this.props.auth.register(this.state.data);
    if (result.succeeded) {
      this.setState({ redirect: true, data: { email: "", password: "", name: "" } });
    } else {
      result.errors.forEach(error => toast.error(error.message));
    }
  };

  render() {
    if (this.state.redirect || this.props.auth.jwt) {
      return <Redirect to="/events" />
    }
    return (
      <div className="container-fluid pt-5 mt-5 mt-md-5 pt-md-5">
      <div className="row mt-5 mt-md-5 col-md-4 offset-md-4">
        <h1>Register</h1>
        <p>Don't have an account? Registration is free! Just give us your deets and get event planning!</p>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "someone@example.com", "text", "Your email")}
          {this.renderInput("password", "Shhh! Don't show anyone!", "password", "Your password")}
          {this.renderInput("name", "Carla Carldot", "text", "Your name")}
          {this.renderButton("Register")}
        </form>
      </div>
      </div>
    );
  }
}

export default withRouter(withAuthorization(RegistrationForm));
