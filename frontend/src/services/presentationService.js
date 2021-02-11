import { call } from './serviceBase';
import { apiUrl } from './httpService';

export async function getAllForEvent(eventId) {
  const url = `${apiUrl}/events/${eventId}/presentations`;
  return call(url, 'presentations', 'get', [401]);
}

export async function create(eventId, email, presenterName, companyName, title, synopsis, hideForm) {
  const url = `${apiUrl}/events/${eventId}/presentations`;
  const body = { email, presenterName, companyName, title, synopsis, hideForm };
  return call(url, 'presentation', 'post', [400, 401], body);
}

export async function approve(eventId, id) {
  const url = `${apiUrl}/events/${eventId}/presentations/${id}/approved`;
  return call(url, 'presentation', 'put', [401]);
}

export async function reject(eventId, id) {
  const url = `${apiUrl}/events/${eventId}/presentations/${id}/rejected`;
  return call(url, 'presentation', 'put', [401]);
}
