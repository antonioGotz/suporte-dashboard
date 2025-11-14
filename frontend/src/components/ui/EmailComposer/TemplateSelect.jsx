import React from 'react';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import { Field, Label, HoverControl } from './EmailComposer.styles';

const Wrapper = styled.div`
  width: 100%;
`;

// Custom dropdown indicator (SVG) — sharp and neutral
const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </components.DropdownIndicator>
);

// Custom styles for react-select
const customStyles = {
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  control: (provided, state) => ({
    ...provided,
    borderRadius: 8,
    borderColor: state.isFocused ? '#2684FF' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 4px rgba(38,132,255,0.12)' : provided.boxShadow,
    '&:hover': { borderColor: '#2684FF' },
    minHeight: 40,
    background: 'var(--panel-glass-bg, rgba(255,255,255,0.04))',
    border: '1px solid var(--panel-glass-border, rgba(255,255,255,0.08))',
    WebkitBackdropFilter: 'blur(var(--panel-glass-blur,10px))',
    backdropFilter: 'blur(var(--panel-glass-blur,10px))',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgba(111,62,248,0.06)' : state.isSelected ? 'rgba(106,62,255,0.12)' : provided.backgroundColor,
    color: 'var(--panel-text, #F0F0F0)',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({ ...provided, color: 'var(--panel-text, #F0F0F0)' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (provided) => ({ ...provided, padding: 8 }),
};

/**
 * TemplateSelect
 * Props:
 * - options: array of { value, label, [any] }
 * - value: selected option (object) or null
 * - onChange: function(selectedOption) => void
 * - placeholder: string
 */
const TemplateSelect = ({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = 'Selecione um template...',
  isClearable = true,
  ariaLabel = 'Template de mensagem',
}) => {
  const handleChange = (selected) => {
    // selected is an option object (or null)
    onChange(selected);
  };

  // react-select expects the selected value to be an option object from `options`.
  // So we allow the parent to pass an object (preferred). If parent sends a primitive value,
  // parent should map it to the option object before passing.

  return (
    <Field>
      <Label>Template de Mensagem</Label>
      <HoverControl>
        <Wrapper>
          <Select
            options={options}
            value={value}
            onChange={handleChange}
            styles={customStyles}
            components={{ DropdownIndicator }}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            menuPosition="fixed"
            placeholder={placeholder}
            isClearable={isClearable}
            aria-label={ariaLabel}
            // keyboard navigation and accessibility are handled by react-select
          />
        </Wrapper>
      </HoverControl>
    </Field>
  );
};

export default TemplateSelect;
