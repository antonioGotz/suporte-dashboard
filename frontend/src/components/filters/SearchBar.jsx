import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  position: relative; margin-top: 8px; max-width: 420px; width: 100%;
`;
const Input = styled.input`
  width: 100%; height: 44px; border-radius: 22px; outline: none;
  background: rgba(2,6,23,.6);
  border: 1px solid rgba(148,163,184,.22);
  color: #e5e7eb; padding: 0 44px 0 42px;
  box-shadow: 0 6px 16px rgba(0,0,0,.18) inset;
  ::placeholder { color: #9aa6b2; }
`;
const Icon = styled.span`
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: #9aa6b2; font-size: 16px; pointer-events: none;
`;
const ClearBtn = styled.button`
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: transparent; border: none; color: #9aa6b2; cursor: pointer; font-size: 16px;
`;

const SearchBar = ({ value, onChange, onSubmit, onClear, placeholder = 'Pesquisar...' }) => (
  <Wrap>
    <Icon>🔍</Icon>
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSubmit?.(); }}
      aria-label="Pesquisar"
    />
    {value && <ClearBtn onClick={onClear} aria-label="Limpar">✕</ClearBtn>}
  </Wrap>
)

export default SearchBar
