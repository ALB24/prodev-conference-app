import { call } from './serviceBase';
import { apiUrl } from './httpService';

export async function getAllForEvent(eventId) {
  const url = `${apiUrl}/events/${eventId}/badges`;
  return await call(url, 'badges', 'get', [401, 409]);
}
