import {
  format,
  isSameYear,
  fromUnixTime,
  formatDistanceToNow,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formats a Unix timestamp into a human-readable time format.
 * @param {number} time - Unix timestamp.
 * @param {string} [dateFormat='h:mm a'] - Desired format of the time.
 * @returns {string} Formatted time string.
 */
export const messageStamp = (time, dateFormat = 'h:mm a') => {
  const unixTime = fromUnixTime(time);
  return format(unixTime, dateFormat, { locale: ptBR });
};

/**
 * Provides a formatted timestamp, adjusting the format based on the current year.
 * @param {number} time - Unix timestamp.
 * @param {string} [dateFormat='MMM d, yyyy'] - Desired date format.
 * @returns {string} Formatted date string.
 */
export const messageTimestamp = (time, dateFormat = 'MMM d, yyyy') => {
  const messageTime = fromUnixTime(time);
  const now = new Date();
  const messageDate = format(messageTime, dateFormat, { locale: ptBR });
  if (!isSameYear(messageTime, now)) {
    return format(messageTime, 'LLL d y, h:mm a', { locale: ptBR });
  }
  return messageDate;
};

/**
 * Converts a Unix timestamp to a relative time string (e.g., 3 hours ago).
 * @param {number} time - Unix timestamp.
 * @returns {string} Relative time string.
 */
export const dynamicTime = time => {
  const unixTime = fromUnixTime(time);
  return formatDistanceToNow(unixTime, { addSuffix: true, locale: ptBR });
};

/**
 * Formats a Unix timestamp into a specified date format.
 * @param {number} time - Unix timestamp.
 * @param {string} [dateFormat='MMM d, yyyy'] - Desired date format.
 * @returns {string} Formatted date string.
 */
export const dateFormat = (time, df = 'MMM d, yyyy') => {
  const unixTime = fromUnixTime(time);
  return format(unixTime, df, { locale: ptBR });
};

/**
 * Converts a detailed time description into a shorter format, optionally appending 'ago'.
 * @param {string} time - Detailed time description (e.g., 'a minute ago').
 * @param {boolean} [withAgo=false] - Whether to append 'ago' to the result.
 * @returns {string} Shortened time description.
 */
export const shortTimestamp = (time, withAgo = false) => {
  // This function takes a time string and converts it to a short time string
  // with the following format: 1m, 1h, 1d, 1mo, 1y
  // The function also takes an optional boolean parameter withAgo
  // which will add the word "ago" to the end of the time string
  const suffix = withAgo ? ' atrás' : '';
  const timeMappings = {
    'há menos de um minuto': 'agora',
    'em menos de um minuto': 'agora',
    'há 1 minuto': `1m${suffix}`,
    'há 1 hora': `1h${suffix}`,
    'há 1 dia': `1d${suffix}`,
    'há 1 mês': `1M${suffix}`,
    'há 1 ano': `1A${suffix}`,
  };
  // Check if the time string is one of the specific cases
  if (timeMappings[time]) {
    return timeMappings[time];
  }

  const convertToShortTime = time
    .replace(/cerca de|over|menos de um|há|/g, '')
    .replace(' minutos', `m${suffix}`)
    .replace(' minuto', `m${suffix}`)
    .replace(' horas', `h${suffix}`)
    .replace(' hora', `h${suffix}`)
    .replace(' dias', `d${suffix}`)
    .replace(' dia', `d${suffix}`)
    .replace(' meses', `M${suffix}`)
    .replace(' mês', `M${suffix}`)
    .replace(' anos', `A${suffix}`)
    .replace(' ano', `A${suffix}`);

  return convertToShortTime;
};
