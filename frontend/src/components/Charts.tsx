import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export function TrancheChart({ data }: { data: { name: string; plan: number; fact: number }[] }) {
  return (
    <section className="panel">
      <h2>Диаграмма траншей (млн ₽)</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#6c7086" opacity={0.35} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="plan" fill="#4c8dff" name="План" />
          <Bar dataKey="fact" fill="#30d158" name="Факт" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

export function CashFlowChart({ data }: { data: { month: string; inflow: number; outflow: number }[] }) {
  return (
    <section className="panel">
      <h2>Cash Flow (млн ₽)</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#6c7086" opacity={0.35} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="inflow" stroke="#30d158" name="Приток" />
          <Line type="monotone" dataKey="outflow" stroke="#ff453a" name="Отток" />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
