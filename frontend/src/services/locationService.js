/* eslint-disable import/no-anonymous-default-export */
import { call } from './serviceBase';
import { apiUrl } from './httpService';

export async function getAllLocations() {
  const url = `${apiUrl}/locations`;
  return await call(url, 'locations', 'get', [401]);
}

export async function createLocation(name, city, state, maximumVendorCount, roomCount) {
  const url = `${apiUrl}/locations`;
  const data = { name, city, state, maximumVendorCount, roomCount };
  return await call(url, 'location', 'post', [400, 401], data);
}
