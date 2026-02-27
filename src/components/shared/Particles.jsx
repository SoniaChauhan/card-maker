'use client';
/**
 * Particles — renders floating emoji icons as background decoration.
 * @param {{ icons: string[], count?: number, style?: object }} props
 */

import { useMemo } from 'react';

export default function Particles({ icons, count = 22, style = {} }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        icon: icons[i % icons.length],
        x:     Math.random() * 100,
        y:     Math.random() * 100,
        size:  14 + Math.random() * 16,
        dur:   5  + Math.random() * 5,
        delay: Math.random() * 4,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      {items.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left:              `${p.x}%`,
            top:               `${p.y}%`,
            fontSize:          `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.delay}s`,
            ...style,
          }}
        >
          {p.icon}
        </div>
      ))}
    </>
  );
}
