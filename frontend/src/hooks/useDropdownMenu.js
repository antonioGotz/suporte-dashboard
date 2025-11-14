import { useState, useRef, useCallback } from 'react';

export function useDropdownMenu() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const menuItemRefs = useRef([]);
  const activeButtonRef = useRef(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    activeButtonRef.current?.focus();
  }, []);

  const handleMenuToggle = useCallback((e) => {
    const isOpen = !isMenuOpen;
    setMenuOpen(isOpen);
    if (isOpen) {
      const btn = e.currentTarget;
      const parent = btn.offsetParent || btn.parentElement || document.body;
      const btnRect = btn.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const left = btnRect.left - parentRect.left;
      const top = btnRect.bottom - parentRect.top + 6;
      setMenuPos({ top, left });
      activeButtonRef.current = btn;
    }
  }, [isMenuOpen]);

  const handleKeyDown = useCallback((ev) => {
    const items = menuItemRefs.current.filter(Boolean);
    if (!items.length) return;

    const currentIndex = items.findIndex((el) => el === document.activeElement);

    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex]?.focus();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      const nextIndex = (currentIndex - 1 + items.length) % items.length;
      items[nextIndex]?.focus();
    } else if (ev.key === 'Home') {
      ev.preventDefault();
      items[0]?.focus();
    } else if (ev.key === 'End') {
      ev.preventDefault();
      items[items.length - 1]?.focus();
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      closeMenu();
    }
  }, [closeMenu]);

  return {
    isMenuOpen,
    menuPos,
    menuItemRefs,
    activeButtonRef,
    handleMenuToggle,
    handleKeyDown,
    closeMenu,
  };
}
