// Utility to calculate Brazilian National Holidays (Feriados Nacionais)

export interface Holiday {
  date: string; // "YYYY-MM-DD"
  name: string;
  type: 'national';
}

// Algoritmo de Butcher/Meeus para cálculo da data da Páscoa
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month, day);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getBrazilianHolidays(year: number): Holiday[] {
  const easter = getEasterDate(year);
  
  // Feriados Móveis baseados na Páscoa
  const carnaval = new Date(easter);
  carnaval.setDate(easter.getDate() - 47);

  const sextaFeiraSanta = new Date(easter);
  sextaFeiraSanta.setDate(easter.getDate() - 2);

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);

  const holidays: Holiday[] = [
    // Feriados Fixos
    { date: `${year}-01-01`, name: 'Confraternização Universal (Ano Novo)', type: 'national' },
    { date: `${year}-04-21`, name: 'Tiradentes', type: 'national' },
    { date: `${year}-05-01`, name: 'Dia do Trabalhador', type: 'national' },
    { date: `${year}-09-07`, name: 'Independência do Brasil', type: 'national' },
    { date: `${year}-10-12`, name: 'Nossa Senhora Aparecida (Padroeira do Brasil)', type: 'national' },
    { date: `${year}-11-02`, name: 'Finados', type: 'national' },
    { date: `${year}-11-15`, name: 'Proclamação da República', type: 'national' },
    { date: `${year}-11-20`, name: 'Dia Nacional de Zumbi e da Consciência Negra', type: 'national' },
    { date: `${year}-12-25`, name: 'Natal', type: 'national' },

    // Feriados Móveis
    { date: formatDate(carnaval), name: 'Carnaval', type: 'national' },
    { date: formatDate(sextaFeiraSanta), name: 'Sexta-feira Santa (Paixão de Cristo)', type: 'national' },
    { date: formatDate(easter), name: 'Páscoa', type: 'national' },
    { date: formatDate(corpusChristi), name: 'Corpus Christi', type: 'national' },
  ];

  return holidays;
}

export function isBrazilianHoliday(date: Date): Holiday | null {
  const year = date.getFullYear();
  const holidays = getBrazilianHolidays(year);
  const targetDateStr = formatDate(date);

  return holidays.find(h => h.date === targetDateStr) || null;
}
