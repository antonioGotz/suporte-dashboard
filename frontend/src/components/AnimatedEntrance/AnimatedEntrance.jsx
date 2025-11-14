import React from 'react';
import './entrance.css';

/**
 * AnimatedEntrance
 * - Wrapper simples que aplica classes/variáveis CSS para controlar uma animação
 * - Usa CSS (keyframes) e respeita prefers-reduced-motion
 * Props:
 * - direction: 'up'|'down'|'left'|'right'
 * - duration: number (ms)
 * - distance: number (px)
 * - delay: number (ms)
 * - disabled: boolean
 */
export default function AnimatedEntrance({
  children,
  direction = 'up',
  duration = 600,
  distance = 20,
  delay = 0,
  disabled = false,
  className = '',
  style = {},
}) {
  // Nota: preferências de redução de movimento são tratadas em CSS, mas
  // mantemos a prop `disabled` para controle explícito via JS.
  const cls = `animated-entrance animated-entrance--${direction} ${disabled ? 'animated-entrance--noanim' : ''} ${className}`.trim();
  const vars = {
    '--anim-duration': `${duration}ms`,
    '--anim-distance': `${distance}px`,
    '--anim-delay': `${delay}ms`,
  };

  return (
    <div className={cls} style={{ ...vars, ...style }}>
      {children}
    </div>
  );
}
