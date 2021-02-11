import React, { useState } from "react";
import { toast } from 'react-toastify';
import { withAuthorization } from '../services/authService';
import { Redirect, withRouter } from "react-router-dom";
import Input from '../common/input';

const handleSubmit = (email, password, login) => e => {
  e.preventDefault();
  login(email, password)
    .then(result => {
      if (!result.succeeded) {
        toast.error('You cannot log in with those credentials.');
      }
    });
}

const LoginForm = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const change = func => e => func(e.target.value);

  return (
    props.auth.jwt ? 
    <Redirect to="/events" /> :
    <>
      <form onSubmit={handleSubmit(email, password, props.auth.login)} id="login-form">
        <Input label="Your email" value={email} onChange={change(setEmail)} name="email" placeholder="someone@example.com" maxLength="100" minLength="1" required />
        <Input label="Your password" type="password" value={password} onChange={change(setPassword)} name="password" placeholder="This is a secret!" maxLength="100" minLength="1" required />
      </form>
      <div>
        <button disabled={!email.length || !password.length} type="submit" form="login-form" className="btn btn-primary">Submit</button>
      </div>
    </>
  );
};

export default withRouter(withAuthorization(LoginForm));
