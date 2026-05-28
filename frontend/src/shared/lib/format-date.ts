import dayjs from 'dayjs';

export const DATE_FORMAT = 'DD.MM.YYYY';
export const DATE_ISO_FORMAT = 'YYYY-MM-DD';

export function formatDate(value: string | Date | dayjs.Dayjs): string {
  return dayjs(value).format(DATE_FORMAT);
}

export function toIsoDate(value: dayjs.Dayjs | Date): string {
  return dayjs(value).format(DATE_ISO_FORMAT);
}
