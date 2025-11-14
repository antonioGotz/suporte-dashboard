import React, { useId } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
// Tornamos o ícone acessível como um botão não estilizado e garantimos que esteja acima do input
const IconButton = styled.button`
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s ease;
  z-index: 2; /* garantir que fica acima do input */
  &:hover { color: var(--accent); }
  &:focus { outline: 2px solid rgba(157,217,210,0.35); border-radius: 8px; }
`;
const SearchInput = styled.input`
  width: 100%;
  background-color: var(--sidebar);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px 12px 48px;
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  &::placeholder { color: var(--muted); }
  &:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-d); }
`;

const SearchButton = styled.button`
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--sidebar);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 3; /* Adicionado para garantir que fique sobre outros elementos */

  &:hover { background: var(--accent-d); border-color: var(--accent-d); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SearchInputWithButton = styled(SearchInput)`
  padding-right: 110px; /* Abre espaço para o botão */
`;

const SearchBar = ({ value, onChange, onSearch, onKeyDown, placeholder, inputRef, disabled = false, id = null, name = null, showSearchButton = false }) => {
  const generatedId = useId();
  const inputId = id || `search-${generatedId}`;
  const inputName = name || 'q';
  
  const InputComponent = showSearchButton ? SearchInputWithButton : SearchInput;

  return (
    <SearchContainer>
        <IconButton type="button" aria-label="Pesquisar" onClick={onSearch}>
          <FaSearch />
        </IconButton>
        <InputComponent
        id={inputId}
        name={inputName}
        type="text"
        placeholder={placeholder || 'Pesquisar...'}
        value={value ?? ''}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={inputRef}
        disabled={disabled}
      />
      {showSearchButton && (
        <SearchButton onClick={onSearch} disabled={disabled}>
          Buscar
        </SearchButton>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
