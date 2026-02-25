export type Health = 'ok' | 'risk' | 'critical' | 'blocked';

export interface EpItem {
  code: string;
  name: string;
  type: 'Производственный' | 'Управленческий' | 'Финансовый';
  status: 'План' | 'В работе' | 'Блокирован' | 'Риск' | 'Завершён';
  plannedStart: string;
  plannedFinish: string;
  actualStart?: string;
  plannedCost: number;
  actualCost: number;
  linkedEp?: string;
  health: Health;
}
