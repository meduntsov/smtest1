import React, { useMemo, useState } from 'react';
import { CashFlowChart, TrancheChart } from './components/Charts';
import { HeatMap } from './components/HeatMap';
import { KpiCard } from './components/KpiCard';
import { aiRecommendations, cashFlowData, epHeatMap, summary, trancheData } from './data/demoData';
import './styles/app.css';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const budgetDelta = useMemo(() => summary.actualBudget - summary.plannedBudget, []);

  return (
    <main className={`app ${theme}`}>
      <header className="top-bar">
        <div>
          <h1>{summary.projectName}</h1>
          <p>Unified WBS: Production + 6D Finance + Decision EP + AI</p>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        </button>
      </header>

      <section className="kpi-grid">
        <KpiCard title="Отклонение по сроку" value={`${summary.scheduleDeviation} дн.`} accent="risk" />
        <KpiCard title="План / Факт бюджета" value={`${(summary.plannedBudget / 1e9).toFixed(2)} / ${(summary.actualBudget / 1e9).toFixed(2)} млрд ₽`} accent={budgetDelta > 0 ? 'critical' : 'ok'} />
        <KpiCard title="EP в риске" value={String(summary.riskCount)} accent="risk" />
        <KpiCard title="EP заблокировано" value={String(summary.blockedCount)} accent="blocked" />
        <KpiCard title="Прогноз завершения" value={summary.forecastFinish} accent="critical" />
      </section>

      <section className="layout-2">
        <HeatMap items={epHeatMap} />
        <section className="panel">
          <h2>AI-рекомендации</h2>
          <ul>
            {aiRecommendations.map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
        </section>
      </section>

      <section className="layout-2">
        <TrancheChart data={trancheData} />
        <CashFlowChart data={cashFlowData} />
      </section>

      <section className="panel">
        <h2>Модули ERP</h2>
        <div className="module-grid">
          <article><h3>Управление WBS</h3><p>Фаза → Стадия → Блок → Подсистема → EP + Work Packages.</p></article>
          <article><h3>Тендерный модуль</h3><p>Сравнение с baseline, выявление отклонений, Change Request.</p></article>
          <article><h3>Change Management</h3><p>Версии, согласование, контроль влияния на срок/бюджет/транши.</p></article>
          <article><h3>Финансы 6D</h3><p>Транши, ковенанты DSCR/LTV, проценты и комиссия за невыборку.</p></article>
        </div>
      </section>
    </main>
  );
}
