import React from 'react';
import { EpItem } from '../types';

const colors = {
  ok: '#30d158',
  risk: '#ffd60a',
  critical: '#ff453a',
  blocked: '#bf5af2'
};

export function HeatMap({ items }: { items: EpItem[] }) {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Heat-map EP</h2>
        <span>{items.length} EP</span>
      </div>
      <div className="heatmap-grid">
        {items.map((item) => (
          <div
            key={item.code}
            className="heat-cell"
            style={{ background: colors[item.health] }}
            title={`${item.code}: ${item.name}`}
          >
            {item.code}
          </div>
        ))}
      </div>
    </section>
  );
}
