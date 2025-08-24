import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

export function toUTC(localIsoString, tz) {
  return zonedTimeToUtc(localIsoString, tz);
}

export function toLocal(utcDate, tz) {
  return utcToZonedTime(utcDate, tz);
}

export function getNowInZone(tz) {
  return toLocal(new Date(), tz);
}
// Formats a Date to 'HH:mm'
export function formatTime(date) {
  return format(date, 'HH:mm');
}

export default { toUTC, toLocal, getNowInZone, formatTime };