import { apiUrl } from './httpService';
import { call } from "./serviceBase";

function fixDates(event) {
  if (event && event.from) event.from = new Date(event.from);
  if (event && event.to) event.to = new Date(event.to);
  if (event && event.created) event.created = new Date(event.created);
}

export async function getAll() {
  const url = `${apiUrl}/events`;
  return await call(url, 'events', 'get', [401]);
}

export async function getDetails(id) {
  const url = `${apiUrl}/events/${id}`;
  const result = await call(url, 'event', 'get', [401, 404]);
  fixDates(result.event);
  return result;
}

export async function create(name, description, locationId ) {
  const url = `${apiUrl}/events`;
  const data = { name, description, locationId };
  return await call(url, 'events', 'post', [400, 401], data);
}

export async function update(id, data) {
  const url = `${apiUrl}/events/${id}`;
  const result = await call(url, 'event', 'put', [400, 401, 409], data);
  fixDates(result.event);
  return result;
}
