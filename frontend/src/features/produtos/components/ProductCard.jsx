import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaPencilAlt, FaTrashAlt, FaVideo, FaImage } from 'react-icons/fa';

// --- ESTILOS ---
const fadeIn = keyframes` from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } `;
const CardWrapper = styled.div`
  background-color: ${({ $zebra }) => $zebra === 'odd' ? 'rgba(148,163,184,.04)' : '#2d3748'};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  transition: background 0.2s, box-shadow 0.3s, transform 0.2s;
  animation: ${fadeIn} 0.5s ease-out;
  &:hover {
    background-color: rgba(78,144,136,.18);
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 12px 30px rgba(78,144,136,.18);
  }
`;
const CardImage = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  background-color: #1a202c;
  border-bottom: 1px solid #4a5568;
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
const CardContent = styled.div` padding: 0.8rem 1rem; flex-grow: 1; display: flex; flex-direction: column; `;
const CardTitle = styled.h3` margin: 0 0 0.5rem 0; color: #fff; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `;
const CardInfo = styled.div` display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.8rem; border-top: 1px solid #4a5568; `;
const Price = styled.span` font-size: 15px; font-weight: 300; color: #9dd9d2; `;
const Stock = styled.span` font-size: 0.8rem; font-weight: 500; background-color: #4a5568; color: #e2e8f0; padding: 0.2rem 0.5rem; border-radius: 6px; `;
const CardActions = styled.div` display: flex; gap: 0.5rem; padding: 0 1rem 0.8rem 1rem; `;
const ActionIconButton = styled.button` background: rgba(255,255,255,0.1); border: none; color: #a0aec0; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; text-decoration: none; &:hover { background: #9dd9d2; color: #1a202c; } `;
// --- FIM DOS ESTILOS ---

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};


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
  // Normaliza caminhos Windows e tenta extrair parte relativa a partir de "images/"
  let v = raw.trim();
  // Troca backslashes por slashes
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

const ProductCard = ({ product, onDelete, idx }) => {
  const imageUrl = resolveMediaUrl(
    product.image_url || product.image || product.photo_url || product.thumbnail_url,
    product.id
  );
  const videoUrl = resolveMediaUrl(product.video_url || product.video, product.id);
  const zebra = (product.id ?? idx) % 2 === 0 ? 'even' : 'odd';

  return (
    <CardWrapper $zebra={zebra}>
      <CardImage>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name || 'Produto'} loading="lazy" />
        ) : (
          <FaImage size={40} />
        )}
      </CardImage>
      <CardContent>
        <CardTitle title={product.name}>{product.name}</CardTitle>
        <CardInfo>
          <Price>{formatCurrency(product.price)}</Price>
          <Stock>Estoque: {product.stock || 0}</Stock>
        </CardInfo>
      </CardContent>
      <CardActions>
        <ActionIconButton as={Link} to={`/produtos/${product.id}/editar`} title="Editar Produto">
          <FaPencilAlt />
        </ActionIconButton>
        <ActionIconButton title="Deletar Produto" onClick={() => onDelete(product.id)}>
          <FaTrashAlt />
        </ActionIconButton>
        {videoUrl && (
          <ActionIconButton as="a" href={videoUrl} target="_blank" rel="noopener noreferrer" title="Ver Vídeo">
            <FaVideo />
          </ActionIconButton>
        )}
      </CardActions>
    </CardWrapper>
  );
};

export default ProductCard;
