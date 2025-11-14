// ARQUIVO: src/features/produtos/components/ProductListItem.jsx

import React from 'react';
import styled from 'styled-components';
import { FaPencilAlt, FaTrashAlt, FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- COMPONENTES ESTILIZADOS ---
const ListItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #4a5568;
  background: ${({ $zebra }) => $zebra === 'odd' ? 'rgba(148,163,184,.04)' : 'rgba(148,163,184,.08)'};
  transition: background 0.2s, transform 0.15s;
  &:hover {
    background: rgba(78,144,136,.18);
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 4px 10px rgba(78,144,136,.12);
  }
  &:last-child { border-bottom: none; }
`;
const ListImage = styled.div`
  width: 50px;
  height: 50px;
  min-width: 50px;
  background-color: #1a202c;
  border-radius: 8px;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4a5568;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const ListInfo = styled.div` flex-grow: 1; display: grid; grid-template-columns: 2fr 1fr 1fr; align-items: center; gap: 1rem; `;
const ListName = styled.span` font-size: 15px; font-weight: 500; color: #fff; `;
const ListText = styled.span` color: #a0aec0; `;
const ListActions = styled.div` display: flex; gap: 0.5rem; justify-content: flex-end; `;
const ActionIconButton = styled.button` background: transparent; border: none; color: #a0aec0; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; text-decoration: none; &:hover { background: #4a5568; color: #fff; } `;
// --- FIM DOS ESTILOS ---

const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || '/storage';
const PUBLIC_IMAGE_BASE = import.meta.env.VITE_PUBLIC_IMAGE_BASE || '/images';

const buildUrl = (base, path) => {
  const normalizedBase = String(base || '').replace(/\/$/, '');
  const normalizedPath = String(path || '').replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
};

function resolveMediaUrl(raw, productId) {
  if (!raw) return null;
  if (typeof raw !== 'string') return null;
  let v = raw.trim();
  v = v.replace(/\\+/g, '/');
  const lower = v.toLowerCase();

  if (/^https?:\/\//i.test(v)) return v;

  if (v.startsWith('/')) {
    return v;
  }

  if (lower.startsWith('images/')) {
    const relative = v.replace(/^images\//i, '');
    return buildUrl(PUBLIC_IMAGE_BASE, relative);
  }

  const imagesIdx = lower.indexOf('/images/');
  if (imagesIdx >= 0) {
    const relative = v.slice(imagesIdx + '/images/'.length);
    return buildUrl(PUBLIC_IMAGE_BASE, relative);
  }

  if (lower.startsWith('/images/')) {
    return v;
  }

  if (lower.startsWith('/storage/')) {
    return buildUrl(STORAGE_BASE_URL, v.replace(/^\/storage\//i, ''));
  }

  if (lower.startsWith('storage/')) {
    return buildUrl(STORAGE_BASE_URL, v.replace(/^storage\//i, ''));
  }

  const storageIdx = lower.indexOf('/storage/');
  if (storageIdx >= 0) {
    const relative = v.slice(storageIdx + '/storage/'.length);
    return buildUrl(STORAGE_BASE_URL, relative);
  }

  if (!v.includes('/') && productId) {
    return buildUrl(PUBLIC_IMAGE_BASE, `${String(productId).trim()}/${v}`);
  }

  return buildUrl(STORAGE_BASE_URL, v);
}

const ProductListItem = ({ product, onDelete, idx }) => {
  const imageUrl = resolveMediaUrl(
    product.image_url || product.image || product.photo_url || product.thumbnail_url,
    product.id
  );

  // Zebra: odd/even baseado no id ou idx
  const zebra = (product.id ?? idx) % 2 === 0 ? 'even' : 'odd';
  return (
    <ListItemWrapper $zebra={zebra}>
      <ListImage>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name || 'Produto'} loading="lazy" />
        ) : (
          <FaImage size={24} />
        )}
      </ListImage>
      <ListInfo>
        <ListName>{product.name}</ListName>
        <ListText>ID: {product.id}</ListText>
        <ListText>Estoque: {product.stock || 0}</ListText>
      </ListInfo>
      <ListActions>
        <ActionIconButton as={Link} to={`/produtos/${product.id}/editar`} title="Editar Produto">
          <FaPencilAlt />
        </ActionIconButton>
        <ActionIconButton title="Deletar Produto" onClick={() => onDelete(product.id)}>
          <FaTrashAlt />
        </ActionIconButton>
      </ListActions>
    </ListItemWrapper>
  );
};

export default ProductListItem;
