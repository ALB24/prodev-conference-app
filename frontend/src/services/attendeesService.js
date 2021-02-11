/* eslint-disable import/no-anonymous-default-export */
import { call } from './serviceBase';
import { apiUrl } from './httpService';

console.log('apiUrl', apiUrl);

export async function getAllForEvent(eventId) {
  const url = `${apiUrl}/events/${eventId}/attendees`;
  return await call(url, 'attendees', 'get', [401]);
}

export async function create(eventId, name, email, companyName) {
  const url = `${apiUrl}/events/${eventId}/attendees`;
  const data = { name, email, companyName };
  return await call(url, 'attendee', 'post', [401], data);
}
