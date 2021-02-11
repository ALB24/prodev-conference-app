/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
import React, { useContext, useState } from "react";
import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from './httpService';
import { Redirect } from "react-router-dom";

const apiEndpointSession = apiUrl + "/session";
const apiEndpointRegister = apiUrl + "/accounts";
const tokenKey = "token";

http.setJwt(getJwt());

async function register({ email, password, name }) {
  const result = { succeeded: false };

  try {
    const data = { email, password, name };
    const response = await http.post(apiEndpointRegister, data);
    const { status, data: { token }, } = response;
    if (status === 201) {
      loginWithJwt(token);
    }
    result.succeeded = true;
  } catch (e) {
    const response = e.response || e;
    result.errors = [{
      code: response.data.code,
      message: response.data.message,
    }];
  }
  return result;
}

async function login(email, password) {
  let response;
  try {
    response = await http.put(apiEndpointSession, { email, password });
  } catch (e) {
    response = e;
  }
  const {
    status,
    data: { token },
  } = response;
  if (status === 201) {
    loginWithJwt(token);
  }
  return {
    succeeded: response.status === 201,
    error: {
      code: response.data.code,
      message: response.data.message,
    },
  };
}

function logout() {
  localStorage.removeItem(tokenKey);
  http.setJwt();
}

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
  http.setJwt(getJwt());
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

const createState = (setAuthStateFunc) => ({
  jwt: getJwt(),
  login: async (email, password) => {
    const result = await login(email, password);
    if (result.succeeded) {
      setAuthStateFunc()((prevState) => ({ ...prevState, jwt: getJwt() }));
    }
    return result;
  },
  logout: async () => {
    logout();
    setAuthStateFunc()((prevState) => ({ ...prevState, jwt: null }));
  },
  register: async (email, password, name) => {
    const result = await register(email, password, name);
    if (result.succeeded) {
      setAuthStateFunc()((prevState) => ({ ...prevState, jwt: getJwt() }));
    }
    return result;
  },
});

const AuthorizationContext = React.createContext({});

export const withAuthorization = (Component) => (props) => {
  return (
    <AuthorizationContext.Consumer>
      {(context) => <Component {...props} auth={context} />}
    </AuthorizationContext.Consumer>
  );
};

export const AuthorizationContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState(createState(() => setAuthState));
  return (
    <AuthorizationContext.Provider value={authState}>
      {children}
    </AuthorizationContext.Provider>
  );
};

export const AuthorizedPage = ({ redirectToPath, children }) => {
  const { jwt } = useContext(AuthorizationContext);
  return !jwt ? <Redirect to={redirectToPath} /> : children;
};

export default {
  login,
  logout,
  loginWithJwt,
  getCurrentUser,
  getJwt,
};
