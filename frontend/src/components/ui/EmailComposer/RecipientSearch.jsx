import React, { useState, useRef, useEffect } from 'react';
import { Field, Label, OptionLabelWrap, OptionName, OptionEmail, DropdownWrapper, DropdownMenu, DropdownItem, EmailIcon, SelectedBox, SelectedName, SelectedEmail, ClearButton, Chevron, Input, HoverControl } from './EmailComposer.styles';

const asyncSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    background: 'var(--panel-glass-bg, var(--panel-surface-1))',
    border: '1px solid var(--panel-glass-border, transparent)',
    WebkitBackdropFilter: 'blur(var(--panel-glass-blur, 10px))',
    backdropFilter: 'blur(var(--panel-glass-blur, 10px))',
    boxShadow: state.isFocused ? '0 0 0 3px var(--ring)' : 'none',
    color: 'inherit',
    minHeight: '44px'
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (provided) => ({
    ...provided,
    background: 'var(--panel-surface-0, var(--surface-0))',
    color: 'inherit',
    borderRadius: 8,
    overflow: 'hidden'
  }),
  // A CHAVE DUPLICADA QUE ESTAVA AQUI FOI REMOVIDA
  option: (provided, state) => ({
    ...provided,
    background: state.isFocused ? 'rgba(111,62,248,0.12)' : 'transparent',
    color: state.isSelected ? '#0b1630' : 'inherit',
    padding: 10
  }),
  singleValue: (provided) => ({ ...provided, color: 'inherit' }),
  placeholder: (provided) => ({ ...provided, color: 'var(--panel-text-muted, var(--text-muted))' }),
  input: (provided) => ({ ...provided, color: 'inherit' }),
  valueContainer: (provided) => ({ ...provided, padding: '6px 8px' }),
  indicatorsContainer: (provided) => ({ ...provided, color: 'inherit' }),
  clearIndicator: (provided) => ({ ...provided, color: 'var(--panel-text-muted, var(--text-muted))' }),
};

// Mock users for demo; in real app this would call an API
const MOCK_USERS = [
  { value: '1', label: 'Ana Silva <ana@exemplo.com>', name: 'Ana Silva', email: 'ana@exemplo.com', id: '1' },
  { value: '2', label: 'Carlos Souza <carlos@exemplo.com>', name: 'Carlos Souza', email: 'carlos@exemplo.com', id: '2' },
  { value: '3', label: 'Mariana Lima <mariana@exemplo.com>', name: 'Mariana Lima', email: 'mariana@exemplo.com', id: '3' },
  { value: '4', label: 'Neiva Santos <neiva@exemplo.com>', name: 'Neiva Santos', email: 'neiva@exemplo.com', id: '4' },
  { value: '5', label: 'José Neiva <jose.neiva@exemplo.com>', name: 'José Neiva', email: 'jose.neiva@exemplo.com', id: '5' },
];

// Helper to normalize (remove diacritics) and lowercase for robust matching
// Usa faixa de combining marks para compatibilidade ampla (evita \p{...})
const normalize = (s = '') => {
  try {
    return s
      ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      : '';
  } catch {
    return String(s || '').toLowerCase();
  }
};

// Return initials for avatar from full name (max 2 letters)
const getInitials = (name = '') => {
  try {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } catch { return '?'; }
};

// Simulate an async API call with filtering (robust: matches name, full email or partial local-part)
// Debounced loader that can call a real API when provided via props
const createLoadOptions = ({ fetchRecipients, minLength = 2 }) => {
  let timer = null;
  return (inputValue) => {
    return new Promise((resolve) => {
      const run = async () => {
        const q = String(inputValue || '').trim();
        // if query is short, show default/mock list
        if (!q) return resolve(MOCK_USERS);
        if (q.length < minLength) return resolve([]);
        // Use real API when provided
        if (typeof fetchRecipients === 'function') {
          try {
            // Debug: registrar a query que chega ao loader e o resultado do fetchRecipients
            // para diagnosticar por que o menu fica vazio.
            // eslint-disable-next-line no-console
            console.debug('[RecipientSearch] loadOptions - query:', q);
            const list = await fetchRecipients(q);
            // Normalize to our option shape
            const options = Array.isArray(list) ? list.map((r) => ({
              value: String(r.id ?? r.value ?? r.email ?? r.name ?? q),
              id: r.id ?? r.value ?? null,
              name: r.name ?? r.label ?? r.email ?? '—',
              email: r.email ?? '',
              label: `${r.name ?? '—'} <${r.email ?? ''}>`,
            })) : [];
            resolve(options);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.debug('[RecipientSearch] loadOptions - fetchRecipients error:', err);
            // On error, gracefully fallback to local filtering of mock
            const nq = normalize(q);
            const filtered = MOCK_USERS.filter((u) => {
              const nName = normalize(u.name);
              const nEmail = normalize(u.email);
              const localPart = normalize(u.email.split('@')[0] || '');
              return nName.includes(nq) || nEmail.includes(nq) || localPart.includes(nq);
            });
            resolve(filtered);
          }
        } else {
          // eslint-disable-next-line no-console
          console.debug('[RecipientSearch] loadOptions - using local mock filter for:', q);
          // No API: local mock filtering
          const nq = normalize(q);
          const filtered = MOCK_USERS.filter((u) => {
            const nName = normalize(u.name);
            const nEmail = normalize(u.email);
            const localPart = normalize(u.email.split('@')[0] || '');
            return nName.includes(nq) || nEmail.includes(nq) || localPart.includes(nq);
          });
          resolve(filtered);
        }
      };
      clearTimeout(timer);
      timer = setTimeout(run, 250); // debounce
    });
  };
};

const RecipientSearch = ({ value = null, onChange, fetchRecipients = null, minLength = 2 }) => {
  const handleChange = (option) => {
    // debug: log selected option to help diagnose issues where selection doesn't propagate
    // eslint-disable-next-line no-console
    console.debug('RecipientSearch selected:', option);
    if (onChange) onChange(option ? { id: option.id, name: option.name, email: option.email } : null);
  };

  // Convert parent value to react-select option shape
  const current = value ? { value: value.id, label: `${value.name} <${value.email}>`, id: value.id, name: value.name, email: value.email } : null;

  const loadOptions = React.useMemo(
    () => createLoadOptions({ fetchRecipients, minLength }),
    [fetchRecipients, minLength]
  );

  // Custom simple autocomplete implementation (reliable rendering)
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // load options when inputValue changes (debounced inside loadOptions)
  useEffect(() => {
    let active = true;
    const run = async () => {
      const q = String(inputValue || '').trim();
      if (!q) {
        setOptions(MOCK_USERS);
        setOpen(Boolean(MOCK_USERS.length));
        return;
      }
      if (q.length < minLength) {
        setOptions([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await loadOptions(q);
        if (!active) return;
        setOptions(Array.isArray(res) ? res : []);
        setOpen(Array.isArray(res) && res.length > 0);
        setHighlight(0);
      } catch (e) {
        // fallback to empty
        setOptions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => { active = false; };
  }, [inputValue, loadOptions, minLength]);

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const onSelect = (option) => {
    setInputValue(option.name || option.label || '');
    setOpen(false);
    if (onChange) onChange(option ? { id: option.id, name: option.name, email: option.email } : null);
  };

  const onClear = (e) => {
    e.stopPropagation();
    // clear selection and focus input for new search
    if (onChange) onChange(null);
    setInputValue('');
    setOpen(true);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) onSelect(opt);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Field ref={wrapperRef}>
      <Label>Pesquisar Destinatário</Label>
      <DropdownWrapper>
        {value ? (
          <SelectedBox onClick={() => {
            setIsEditing(true);
            setOpen(true);
            setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
          }}>
            {isEditing ? (
              <HoverControl>
                <Input
                  ref={inputRef}
                  aria-label="Pesquisar destinatário"
                  value={inputValue}
                  onChange={onInputChange}
                  onKeyDown={onKeyDown}
                  placeholder="Digite um nome ou e-mail para buscar..."
                  minLength={1}
                  onFocus={() => { if (options.length) setOpen(true); }}
                  onBlur={() => { setIsEditing(false); if (!open) setInputValue(''); }}
                />
              </HoverControl>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <EmailIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13a2.5 2.5 0 0 0 2.5-2.5v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 7.2l-9 6-9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </EmailIcon>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <SelectedName>{value.name}</SelectedName>
                  <SelectedEmail>{value.email}</SelectedEmail>
                </div>
                <ClearButton onClick={onClear} aria-label="Limpar seleção">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ClearButton>
                <Chevron $open={open} aria-hidden>{/* simple chevron SVG */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Chevron>
              </div>
            )}
          </SelectedBox>
        ) : (
          <HoverControl>
            <Input
              aria-label="Pesquisar destinatário"
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              placeholder="Digite um nome ou e-mail para buscar..."
              onFocus={() => { if (options.length) setOpen(true); }}
            />
          </HoverControl>
        )}

        {open && (
          <DropdownMenu role="listbox">
            {options.map((opt, idx) => (
              <DropdownItem
                key={opt.value ?? idx}
                className={idx === highlight ? 'highlighted' : ''}
                onMouseDown={(ev) => { ev.preventDefault(); onSelect(opt); }}
                onMouseEnter={() => setHighlight(idx)}
              >
                <EmailIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13a2.5 2.5 0 0 0 2.5-2.5v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 7.2l-9 6-9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </EmailIcon>
                <OptionLabelWrap>
                  <OptionName>{opt.name}</OptionName>
                  <OptionEmail>{opt.email}</OptionEmail>
                </OptionLabelWrap>
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </DropdownWrapper>
    </Field>
  );
};

export default RecipientSearch;