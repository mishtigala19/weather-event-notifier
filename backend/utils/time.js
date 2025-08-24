import * as tz from 'date-fns-tz';
import { format } from 'date-fns';

export function toUTC(localIsoString, timeZone) {
  return tz.zonedTimeToUtc(localIsoString, timeZone);
}

export function toLocal(utcDate, timeZone) {
  return tz.utcToZonedTime(utcDate, timeZone);
}

export function getNowInZone(timeZone) {
  return toLocal(new Date(), timeZone);
}
// Formats a Date to 'HH:mm'
export function formatTime(date) {
  return format(date, 'HH:mm');
}

export default { toUTC, toLocal, getNowInZone, formatTime };