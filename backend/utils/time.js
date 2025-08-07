const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const { format } = require('date-fns');

function toUTC(localIsoString, tz) {
  return zonedTimeToUtc(localIsoString, tz);
}

function toLocal(utcDate, tz) {
  return utcToZonedTime(utcDate, tz);
}

function getNowInZone(tz) {
  return toLocal(new Date(), tz);
}
// Formats a Date to 'HH:mm'
function formatTime(date) {
  return format(date, 'HH:mm');
}

module.exports = { toUTC, toLocal, getNowInZone, formatTime };