import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';
import * as productsService from '../services/productsService';
import SuccessModal from '../../../components/SuccessModal.jsx';

// --- COMPONENTES ESTILIZADOS ---
const Container = styled.div`
  width: 96vw;
  max-width: 1400px;
  margin: 32px auto;
  background: #19232e;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  padding: 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;
const EditPageLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
`;
const PreviewPanel = styled.div`
  background-color: #2d3748;
  padding: 1.5rem 2rem;
  border-radius: 15px;
`;
const ProductImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #1a202c;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4a5568;
  border: 1px solid #4a5568;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
`;
const FormCol = styled.div`
  flex: 1 1 400px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: flex-start;
`;
const FormInput = styled.input`
  width: 100%;
  min-width: 220px;
  max-width: 420px;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #4a5568;
  background-color: #1a202c;
  color: #fff;
  font-size: 0.92rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 2px rgba(157, 217, 210, 0.2);
    outline: none;
  }
`;
const FormTextArea = styled.textarea`
  width: 100%;
  min-width: 220px;
  max-width: 420px;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #4a5568;
  background-color: #1a202c;
  color: #fff;
  font-size: 0.92rem;
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 2px rgba(157, 217, 210, 0.2);
    outline: none;
  }
`;
const FileInputWrapper = styled.div`
  background-color: #1a202c;
  border: 1px solid #4a5568;
  border-radius: 6px;
  padding: 0.5rem 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: #a0aec0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 0.7rem;
    font-size: 0.85rem;
  }
  label {
    background-color: #4a5568;
    color: #fff;
    padding: 0.3rem 0.7rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
    font-size: 0.85rem;
    &:hover {
      background-color: #718096;
    }
  }
  input[type="file"] {
    display: none;
  }
`;
const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 1rem;
`;
const SubmitButton = styled.button`
  background-color: #9dd9d2;
  color: #1a202c;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }
  &:hover:not(:disabled) {
    background-color: #86c7bf;
    transform: translateY(-2px);
  }
`;
const CancelLink = styled(Link)`
  background-color: #4a5568;
  color: #fff;
  border-radius: 6px;
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  &:hover {
    background-color: #718096;
  }
`;
const FormLabel = styled.label`
  font-weight: 500;
  margin-bottom: -0.2rem;
  font-size: 0.88rem;
`;
// --- FIM DOS ESTILOS ---

const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || '/storage';
const PUBLIC_IMAGE_BASE = import.meta.env.VITE_PUBLIC_IMAGE_BASE || '/images';

const buildUrl = (base, path) => {
  const normalizedBase = String(base || '').replace(/\/$/, '');
  const normalizedPath = String(path || '').replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedPath}`;
};

const resolveMediaUrl = (raw, productId) => {
  if (!raw || typeof raw !== 'string') return null;
  let value = raw.trim().replace(/\\+/g, '/');
  const lower = value.toLowerCase();

  if (/^https?:\/\//i.test(value)) return value;

  if (value.startsWith('/')) return value;

  if (lower.startsWith('images/')) {
    const relative = value.replace(/^images\//i, '');
    return buildUrl(PUBLIC_IMAGE_BASE, relative);
  }

  const imagesIdx = lower.indexOf('/images/');
  if (imagesIdx >= 0) {
    const relative = value.slice(imagesIdx + '/images/'.length);
    return buildUrl(PUBLIC_IMAGE_BASE, relative);
  }

  if (lower.startsWith('/images/')) {
    return value;
  }

  if (lower.startsWith('/storage/')) {
    return buildUrl(STORAGE_BASE_URL, value.replace(/^\/storage\//i, ''));
  }

  if (lower.startsWith('storage/')) {
    return buildUrl(STORAGE_BASE_URL, value.replace(/^storage\//i, ''));
  }

  const storageIdx = lower.indexOf('/storage/');
  if (storageIdx >= 0) {
    const relative = value.slice(storageIdx + '/storage/'.length);
    return buildUrl(STORAGE_BASE_URL, relative);
  }

  if (!value.includes('/') && productId) {
    return buildUrl(PUBLIC_IMAGE_BASE, `${String(productId).trim()}/${value}`);
  }

  return buildUrl(STORAGE_BASE_URL, value);
};

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productsService.getProductById(productId);
        setProductData(response.data);
      } catch (error) {
        console.error("Não foi possível carregar o produto:", error);
        alert("Não foi possível carregar o produto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevState => ({ ...prevState, [name]: value }));
  };
  const handleImageChange = (e) => { setImageFile(e.target.files[0]); };
  const handleVideoChange = (e) => { setVideoFile(e.target.files[0]); };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('Atualizando produto...');
    try {
      await productsService.updateProduct(productId, productData, imageFile, videoFile);
      setIsSuccessModalOpen(true);
    } catch (err) {
      setUploadStatus('Erro ao atualizar o produto.');
      console.error(err);
    }
  };

  if (loading) return <Container><h2 style={{ textAlign: 'center', margin: '40px 0' }}>Carregando produto...</h2></Container>;
  if (!productData) return <Container><h2 style={{ textAlign: 'center', margin: '40px 0' }}>Produto não encontrado.</h2></Container>;

  const imageUrl = resolveMediaUrl(
    productData.image_url || productData.image || productData.photo_url || productData.thumbnail_url,
    productData.id
  );

  return (
    <Container>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Editar Produto: <span style={{ color: '#9dd9d2' }}>{productData.name}</span></h1>
      <EditPageLayout>
        <PreviewPanel style={{ minWidth: 220, maxWidth: 320 }}>
          <h3 style={{ marginBottom: 16 }}>Visualização Atual</h3>
          <ProductImage>
            {imageUrl ? (
              <img src={imageUrl} alt={productData.name || 'Produto'} loading="lazy" />
            ) : (
              <FaImage size={40} />
            )}
          </ProductImage>
          <p><strong>Preço:</strong> <span style={{ color: '#9dd9d2' }}>{productData.price}</span></p>
          <p><strong>Estoque:</strong> <span style={{ color: '#9dd9d2' }}>{productData.stock}</span></p>
          <p><strong>Descrição:</strong> <span style={{ color: '#e2e8f0' }}>{productData.description}</span></p>
        </PreviewPanel>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '2rem', color: '#9dd9d2', textAlign: 'left' }}>Novas Informações</h3>
          <Form onSubmit={handleFormSubmit}>
            <FormCol>
              <FormLabel>Nome do Produto <span style={{ color: '#ef4444' }}>*</span></FormLabel>
              <FormInput type="text" name="name" value={productData.name} onChange={handleInputChange} required placeholder="Nome do produto" />
              <FormLabel>Preço <span style={{ color: '#ef4444' }}>*</span></FormLabel>
              <FormInput type="number" step="0.01" name="price" value={productData.price} onChange={handleInputChange} required placeholder="R$" />
              <FormLabel>Imagem (atual: {productData.image || 'nenhuma'})</FormLabel>
              <FileInputWrapper>
                <span>{imageFile ? imageFile.name : 'Escolher nova imagem'}</span>
                <label htmlFor="imageFile">Selecionar</label>
                <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} />
              </FileInputWrapper>
            </FormCol>
            <FormCol>
              <FormLabel>Descrição</FormLabel>
              <FormTextArea name="description" value={productData.description || ''} onChange={handleInputChange} placeholder="Descrição do produto" />
              <FormLabel>Estoque <span style={{ color: '#ef4444' }}>*</span></FormLabel>
              <FormInput type="number" name="stock" value={productData.stock} onChange={handleInputChange} required placeholder="Quantidade" />
              <FormLabel>Vídeo (atual: {productData.video || 'nenhum'})</FormLabel>
              <FileInputWrapper>
                <span>{videoFile ? videoFile.name : 'Escolher novo vídeo'}</span>
                <label htmlFor="videoFile">Selecionar</label>
                <input type="file" id="videoFile" accept="video/*" onChange={handleVideoChange} />
              </FileInputWrapper>
            </FormCol>
            {uploadStatus && <p style={{ color: uploadStatus.startsWith('Erro') ? '#ef4444' : '#9dd9d2', marginTop: 6, fontSize: '0.85rem' }}>{uploadStatus}</p>}
            <FormActions>
              <CancelLink to="/produtos">Cancelar</CancelLink>
              <SubmitButton type="submit" disabled={uploadStatus && !uploadStatus.startsWith('Erro')}>
                {uploadStatus && !uploadStatus.startsWith('Erro') ? uploadStatus : 'Salvar Alterações'}
              </SubmitButton>
            </FormActions>
          </Form>
        </div>
      </EditPageLayout>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/produtos');
        }}
        title="Sucesso!"
        message="Produto atualizado com sucesso!"
      />
    </Container>
  );
};

export default ProductEditPage;