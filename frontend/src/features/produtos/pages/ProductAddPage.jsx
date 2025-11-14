import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import * as productsService from '../services/productsService';
import SuccessModal from '../../../components/SuccessModal.jsx';

// --- COMPONENTES ESTILIZADOS ---
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem; /* Aumentando o espaçamento */
  max-width: 700px;
`;
const FormInput = styled.input`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #4a5568;
  background-color: #1a202c; color: #fff; font-size: 1rem; box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3);
    outline: none;
  }
`;
const FormTextArea = styled.textarea`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #4a5568;
  background-color: #1a202c; color: #fff; font-size: 1rem; box-sizing: border-box;
  min-height: 120px; resize: vertical; font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3);
    outline: none;
  }
`;
const FileInputWrapper = styled.div`
  background-color: #1a202c; border: 1px solid #4a5568; border-radius: 8px;
  padding: 0.8rem; display: flex; justify-content: space-between; align-items: center;
  span { color: #a0aec0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 1rem; }
  label {
    background-color: #4a5568; color: #fff; padding: 0.5rem 1rem; border-radius: 6px;
    cursor: pointer; transition: background-color 0.2s ease; flex-shrink: 0;
    &:hover { background-color: #718096; }
  }
  input[type="file"] { display: none; }
`;
const FormActions = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
`;
const SubmitButton = styled.button`
  background-color: #9dd9d2; color: #1a202c; border: none; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
  &:disabled { background-color: #555; cursor: not-allowed; opacity: 0.7; }
  &:hover:not(:disabled) { background-color: #86c7bf; transform: translateY(-2px); }
`;
const CancelLink = styled(Link)`
  background-color: #4a5568; color: #fff; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; text-decoration: none;
  &:hover { background-color: #718096; }
`;
const FormLabel = styled.label`
  font-weight: 600;
  margin-bottom: -0.5rem; /* Puxa o input para mais perto */
`;


const ProductAddPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({ name: '', description: '', price: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevState => ({ ...prevState, [name]: value }));
  };
  const handleImageChange = (e) => { setImageFile(e.target.files[0]); };
  const handleVideoChange = (e) => { setVideoFile(e.target.files[0]); };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('Salvando produto...');
    try {
      await productsService.createProduct(productData, imageFile, videoFile);
      setIsSuccessModalOpen(true);
    } catch (err) {
      setUploadStatus('Erro ao salvar o produto.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Adicionar Novo Produto</h1>
      <p style={{ marginBottom: '2rem' }}>Preencha os dados abaixo para cadastrar um novo item no catálogo.</p>
      <Form onSubmit={handleFormSubmit}>
        <FormLabel>Nome do Produto</FormLabel>
        <FormInput type="text" name="name" value={productData.name} onChange={handleInputChange} required />

        <FormLabel>Descrição</FormLabel>
        <FormTextArea name="description" value={productData.description} onChange={handleInputChange} />

        <FormLabel>Preço (ex: 179.90)</FormLabel>
        <FormInput type="number" step="0.01" name="price" value={productData.price} onChange={handleInputChange} required />

        <FormLabel>Estoque</FormLabel>
        <FormInput type="number" name="stock" value={productData.stock} onChange={handleInputChange} required />

        <FormLabel>Imagem</FormLabel>
        <FileInputWrapper>
          <span>{imageFile ? imageFile.name : 'Nenhum arquivo selecionado'}</span>
          <label htmlFor="imageFile">Selecionar</label>
          <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} />
        </FileInputWrapper>

        <FormLabel>Vídeo</FormLabel>
        <FileInputWrapper>
          <span>{videoFile ? videoFile.name : 'Nenhum arquivo selecionado'}</span>
          <label htmlFor="videoFile">Selecionar</label>
          <input type="file" id="videoFile" accept="video/*" onChange={handleVideoChange} />
        </FileInputWrapper>

        {uploadStatus && <p>{uploadStatus}</p>}

        <FormActions>
          <CancelLink to="/produtos">Cancelar</CancelLink>
          <SubmitButton type="submit" disabled={uploadStatus && !uploadStatus.startsWith('Erro')}>
            {uploadStatus && !uploadStatus.startsWith('Erro') ? uploadStatus : 'Salvar Produto'}
          </SubmitButton>
        </FormActions>
      </Form>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/produtos');
        }}
        title="Sucesso!"
        message="Produto criado com sucesso!"
      />
    </div>
  );
};
export default ProductAddPage;