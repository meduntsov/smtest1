import { EpItem } from '../types';

export const summary = {
  projectName: 'ЖК Северный Парк — Проект 360°',
  scheduleDeviation: 24,
  plannedBudget: 8_700_000_000,
  actualBudget: 8_930_000_000,
  riskCount: 11,
  blockedCount: 4,
  forecastFinish: '14.03.2027'
};

export const aiRecommendations = [
  'Фасад Корпус 1 имеет отставание 18 дней. С высокой вероятностью это вызовет сдвиг транша №2 и рост процентной нагрузки на 4,2 млн руб.',
  'Тендер на лифтовое оборудование не завершён. Риск блокировки ввода в эксплуатацию через 60 дней.',
  'Вероятность нарушения ковенанта DSCR в Q4: 42%. Рекомендуется перенос части CAPEX на следующий период.'
];

export const epHeatMap: EpItem[] = Array.from({ length: 60 }, (_, i) => {
  const healthCycle: EpItem['health'][] = ['ok', 'risk', 'critical', 'blocked'];
  const statusMap = {
    ok: 'В работе',
    risk: 'Риск',
    critical: 'Риск',
    blocked: 'Блокирован'
  } as const;
  const typeMap: EpItem['type'][] = ['Производственный', 'Управленческий', 'Финансовый'];
  const health = healthCycle[i % healthCycle.length];

  return {
    code: `EP-${String(i + 1).padStart(3, '0')}`,
    name: `Корпус ${(i % 3) + 1} / Пакет ${i + 1}`,
    type: typeMap[i % 3],
    status: statusMap[health],
    plannedStart: '2026-01-01',
    plannedFinish: '2026-06-30',
    actualStart: '2026-01-08',
    plannedCost: 25_000_000 + i * 750_000,
    actualCost: 22_000_000 + i * 820_000,
    linkedEp: i > 0 ? `EP-${String(i).padStart(3, '0')}` : undefined,
    health
  };
});

export const trancheData = [
  { name: 'Транш 1', plan: 900, fact: 900 },
  { name: 'Транш 2', plan: 1200, fact: 1030 },
  { name: 'Транш 3', plan: 1700, fact: 500 }
];

export const cashFlowData = [
  { month: 'Янв', inflow: 310, outflow: 280 },
  { month: 'Фев', inflow: 450, outflow: 470 },
  { month: 'Мар', inflow: 420, outflow: 490 },
  { month: 'Апр', inflow: 530, outflow: 520 },
  { month: 'Май', inflow: 610, outflow: 640 },
  { month: 'Июн', inflow: 700, outflow: 760 }
];
