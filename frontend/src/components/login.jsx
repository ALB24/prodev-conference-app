import React from "react";

import LoginForm from './loginForm';

const Login = () => {
  return  (
    <div className="container-fluid pt-5 mt-5 mt-md-5 pt-md-5">
      <div className="row mt-5 mt-md-5 col-md-4 offset-md-4">
        <h1>Login</h1>
        <p>Welcome back! Do you remember your password? We hope so...</p>
        <LoginForm/>
      </div>
    </div>
  )   
};

export default Login;
