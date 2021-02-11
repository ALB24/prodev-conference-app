/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error(`An unexpected error occurrred. (${error.response.status})`);
  }

  return Promise.reject({
    status: error.response.status,
    message: error.response.statusText,
    data: error.response.data,
  });
});

function setJwt(jwt) {
  if (jwt) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
  } else {
    axios.defaults.headers.common["Authorization"] = undefined;
  }
}

export const apiUrl = process.env['REACT_APP_API_URL'];

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  apiUrl,
};
