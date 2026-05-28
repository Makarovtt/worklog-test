export type MeasurementUnit =
  | 'CUBIC_METER'
  | 'SQUARE_METER'
  | 'LINEAR_METER'
  | 'TON'
  | 'PIECE'
  | 'HOUR';

const UNIT_LABELS: Record<MeasurementUnit, string> = {
  CUBIC_METER: 'м³',
  SQUARE_METER: 'м²',
  LINEAR_METER: 'м.п.',
  TON: 'т',
  PIECE: 'шт',
  HOUR: 'ч',
};

const UNIT_FULL_LABELS: Record<MeasurementUnit, string> = {
  CUBIC_METER: 'Кубический метр',
  SQUARE_METER: 'Квадратный метр',
  LINEAR_METER: 'Погонный метр',
  TON: 'Тонна',
  PIECE: 'Штука',
  HOUR: 'Час',
};

export function getUnitLabel(unit: MeasurementUnit): string {
  return UNIT_LABELS[unit];
}

export function getUnitFullLabel(unit: MeasurementUnit): string {
  return UNIT_FULL_LABELS[unit];
}

export function formatVolume(value: string | number, unit: MeasurementUnit): string {
  const numeric = typeof value === 'string' ? Number(value) : value;
  const formatted = Number.isInteger(numeric)
    ? numeric.toString()
    : numeric.toLocaleString('ru-RU', { maximumFractionDigits: 3 });
  return `${formatted} ${getUnitLabel(unit)}`;
}
