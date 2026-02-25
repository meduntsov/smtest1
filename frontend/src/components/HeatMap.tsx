import React, { useMemo, useState } from 'react';
import { EpItem } from '../types';

const colors = {
  ok: '#30d158',
  risk: '#ffd60a',
  critical: '#ff453a',
  blocked: '#bf5af2'
};

export function HeatMap({ items }: { items: EpItem[] }) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.code === selectedCode) ?? null,
    [items, selectedCode]
  );

  const incomingLinks = useMemo(
    () =>
      selectedItem
        ? items.filter((item) => item.linkedEp === selectedItem.code)
        : [],
    [items, selectedItem]
  );

  const relatedCodes = useMemo(() => {
    if (!selectedItem) {
      return new Set<string>();
    }

    return new Set([
      selectedItem.code,
      ...(selectedItem.linkedEp ? [selectedItem.linkedEp] : []),
      ...incomingLinks.map((item) => item.code)
    ]);
  }, [selectedItem, incomingLinks]);

  const openItem = (code: string) => {
    setSelectedCode(code);
  };

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Heat-map EP</h2>
        <span>{items.length} EP</span>
      </div>
      <div className="heatmap-grid">
        {items.map((item) => (
          <button
            key={item.code}
            type="button"
            className={`heat-cell ${selectedItem ? (relatedCodes.has(item.code) ? 'is-related' : 'is-faded') : ''} ${selectedCode === item.code ? 'is-selected' : ''}`}
            style={{ background: colors[item.health] }}
            title={`${item.code}: ${item.name}`}
            onClick={() => openItem(item.code)}
          >
            {item.code}
          </button>
        ))}
      </div>
      <p className="heatmap-hint">Нажмите на EP, чтобы провалиться в карточку и увидеть связи.</p>

      {selectedItem && (
        <article className="heatmap-drilldown">
          <div className="panel-title-row">
            <h3>{selectedItem.code}</h3>
            <span>{selectedItem.status}</span>
          </div>
          <p>{selectedItem.name}</p>
          <div className="heatmap-meta-grid">
            <span><strong>Тип:</strong> {selectedItem.type}</span>
            <span><strong>План:</strong> {selectedItem.plannedStart} → {selectedItem.plannedFinish}</span>
            <span><strong>Бюджет:</strong> {(selectedItem.actualCost / 1_000_000).toFixed(1)} / {(selectedItem.plannedCost / 1_000_000).toFixed(1)} млн ₽</span>
          </div>

          <div className="heatmap-links">
            <h4>Связи EP</h4>
            {selectedItem.linkedEp ? (
              <button type="button" className="link-chip" onClick={() => selectedItem.linkedEp && openItem(selectedItem.linkedEp)}>
                ← Зависит от {selectedItem.linkedEp}
              </button>
            ) : (
              <span className="link-empty">Нет входящей зависимости</span>
            )}

            {incomingLinks.length > 0 ? (
              <div className="link-chip-list">
                {incomingLinks.map((item) => (
                  <button key={item.code} type="button" className="link-chip" onClick={() => openItem(item.code)}>
                    {item.code} зависит от {selectedItem.code} →
                  </button>
                ))}
              </div>
            ) : (
              <span className="link-empty">Нет исходящих связей</span>
            )}
          </div>
        </article>
      )}
    </section>
  );
}
