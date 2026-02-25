import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  accent?: 'ok' | 'risk' | 'critical' | 'blocked';
}

const accentMap = {
  ok: '#30d158',
  risk: '#ffd60a',
  critical: '#ff453a',
  blocked: '#bf5af2'
};

export function KpiCard({ title, value, accent = 'ok' }: KpiCardProps) {
  return (
    <article className="kpi-card" style={{ borderColor: accentMap[accent] }}>
      <p>{title}</p>
      <h3>{value}</h3>
    </article>
  );
}
