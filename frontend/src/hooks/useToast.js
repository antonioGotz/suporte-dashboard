
import { useState, useCallback, useRef } from 'react';

// Hook customizado para exibir toasts (notificações rápidas)
export default function useToast() {
	const [toast, setToast] = useState(null);
  const timer1 = useRef(null); // inicia fade-out
  const timer2 = useRef(null); // remove após animação

  const clearTimers = () => {
    if (timer1.current) { clearTimeout(timer1.current); timer1.current = null; }
    if (timer2.current) { clearTimeout(timer2.current); timer2.current = null; }
  };

	// Exibe um toast do tipo ('success', 'error', 'info', 'warning')
	const showToast = useCallback((type, message, options = {}) => {
    clearTimers();
    // Normaliza mensagem (aceita string ou objeto)
    let duration = 8000;
    if (options && typeof options.duration === 'number') {
      duration = options.duration;
    } else if (message && typeof message === 'object' && typeof message.duration === 'number') {
      duration = message.duration;
    }
    const messageObj = typeof message === 'object' && message !== null
      ? { ...message, exiting: false }
      : { title: '', body: message, exiting: false };

    setToast({ type, message: messageObj });

    // Agenda fade-out suave e remoção após a animação (0.5s)
    timer1.current = setTimeout(() => {
      setToast(prev => prev ? { ...prev, message: { ...(prev.message || {}), exiting: true } } : prev);
    }, duration);
    timer2.current = setTimeout(() => {
      setToast(null);
    }, duration + 500);
	}, []);

	// Fecha manualmente com fade-out
	const exit = useCallback(() => {
    clearTimers();
    // dispara saída suave e remove após 0.5s
    setToast(prev => prev ? { ...prev, message: { ...(prev.message || {}), exiting: true } } : prev);
    timer2.current = setTimeout(() => setToast(null), 500);
	}, []);

	return { showToast, toast, exit };
}
