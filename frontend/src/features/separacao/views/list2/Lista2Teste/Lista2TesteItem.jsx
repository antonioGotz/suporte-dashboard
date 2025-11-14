import React, { useRef, useState } from 'react';
import * as S from './Lista2Teste.styles.js';

export default function Lista2TesteItem({ item, stage, product, statusPipeline = [], labelLocked = {}, isUpdating = false, onAdvance, onGenerate }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRefs = useRef([]);

  const handleToggle = () => {
    const isOpen = !open;
    setOpen(isOpen);
    if (isOpen) {
      const btn = buttonRef.current;
      const parent = btn.offsetParent || btn.parentElement || document.body;
      const btnRect = btn.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const left = btnRect.left - parentRect.left;
      const top = btnRect.bottom - parentRect.top + 6;
      setMenuPos({ top, left });
      // focus first menu item after open
      setTimeout(() => menuRefs.current[0]?.focus(), 10);
    }
  };

  const handleKeyDown = (ev) => {
    const items = menuRefs.current.filter(Boolean);
    const current = items.findIndex((el) => el === document.activeElement);
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      const next = items[(current + 1 + items.length) % items.length] || items[0];
      next?.focus();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      const prev = items[(current - 1 + items.length) % items.length] || items[items.length - 1];
      prev?.focus();
    } else if (ev.key === 'Home') {
      ev.preventDefault();
      items[0]?.focus();
    } else if (ev.key === 'End') {
      ev.preventDefault();
      items[items.length - 1]?.focus();
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <S.Card>
      <S.CardHeader>
        <div>
          <S.CardTitle>{item.mother_name || '—'}</S.CardTitle>
          <S.CardSubtitle>{item.baby_name || ''}</S.CardSubtitle>
        </div>
        <S.CardRight>#{item.order_id}</S.CardRight>
      </S.CardHeader>
      <S.CardProduct>{product}</S.CardProduct>
      <S.CardMeta>{item.plan_name || ''}</S.CardMeta>
      <S.CardFooter>
        <S.StatusBadge bg={stage?.bg} color={stage?.color}>{stage?.statusLabel || item.status || '—'}</S.StatusBadge>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <S.ActionButton onClick={() => onAdvance?.(item.order_id, 'next')} disabled={isUpdating}>Avançar</S.ActionButton>
          <S.MenuButton ref={buttonRef} aria-haspopup="menu" aria-expanded={open} onClick={handleToggle}>Definir ▾</S.MenuButton>
          {open && (
            <S.MenuList role="menu" style={{ top: menuPos.top, left: menuPos.left }} onKeyDown={handleKeyDown}>
              {statusPipeline.filter(s => !('isFallback' in s)).map((s, i) => (
                <S.MenuItem
                  key={s.statusCode}
                  tabIndex={0}
                  ref={(el) => { menuRefs.current[i] = el; }}
                  onClick={async () => { setOpen(false); await onAdvance?.(item.order_id, s.statusCode); }}
                >
                  {s.statusLabel}
                </S.MenuItem>
              ))}
              {(labelLocked[item.order_id] || item.label_generated) && (
                <S.MenuItem tabIndex={0} onClick={() => { setOpen(false); onGenerate?.(item.order_id); }}>
                  Ver histórico de etiquetas
                </S.MenuItem>
              )}
            </S.MenuList>
          )}
        </div>
      </S.CardFooter>
    </S.Card>
  );
}
