import {
  format,
  isSameYear,
  fromUnixTime,
  formatDistanceToNow,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export default {
  methods: {
    messageStamp(time, dateFormat = 'h:mm a') {
      const unixTime = fromUnixTime(time);
      return format(unixTime, dateFormat, { locale: ptBR });
    },
    messageTimestamp(time, dateFormat = 'MMM d, yyyy') {
      const messageTime = fromUnixTime(time);
      const now = new Date();
      const messageDate = format(messageTime, dateFormat, { locale: ptBR });
      if (!isSameYear(messageTime, now)) {
        return format(messageTime, 'LLL d y, h:mm a', { locale: ptBR });
      }
      return messageDate;
    },
    dynamicTime(time) {
      const unixTime = fromUnixTime(time);
      return formatDistanceToNow(unixTime, { addSuffix: true, locale: ptBR });
    },
    dateFormat(time, dateFormat = 'MMM d, yyyy') {
      const unixTime = fromUnixTime(time);
      return format(unixTime, dateFormat, { locale: ptBR });
    },
    shortTimestamp(time, withAgo = false) {
      // This function takes a time string and converts it to a short time string
      // with the following format: 1m, 1h, 1d, 1mo, 1y
      // The function also takes an optional boolean parameter withAgo
      // which will add the word "ago" to the end of the time string
      const suffix = withAgo ? ' atrás' : '';
      const timeMappings = {
        'há menos de um minuto': 'agora',
        'há 1 minuto': `1m${suffix}`,
        'há 1 hora': `1h${suffix}`,
        'há 1 dia': `1d${suffix}`,
        'há 1 mês': `1me${suffix}`,
        'há 1 ano': `1a${suffix}`,
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
        .replace(' meses', `me${suffix}`)
        .replace(' mês', `me${suffix}`)
        .replace(' anos', `a${suffix}`)
        .replace(' ano', `a${suffix}`);

      return convertToShortTime;
    },
  },
};
