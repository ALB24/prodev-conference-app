import http from './httpService';
import auth from './authService';

export async function call(url, dataKey, method, expectedErrors, body) {
  const result = { succeeded: false };
  try {
    const response = await http[method](url, body);
    result.succeeded = true;
    result[dataKey] = response.data;
  } catch (e) {
    const response = e.response || e;
    if (response.status === 401) {
      response.unauthorized = true;
      auth.logout();
    }
    if (expectedErrors.includes(response.status)) {
      result.errors = [response.data];
    } else {
      result.errors = [{
        message: 'Something is wrong with the service. Please try again later.',
      }];
    }
  }
  return result;
}
