import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaArrowUp, FaArrowDown, FaTh, FaList } from 'react-icons/fa';
import * as productsService from '../services/productsService';
import ProductCard from '../components/ProductCard.jsx';
import ProductListItem from '../components/ProductListItem.jsx';
import ConfirmationModal from '../../../components/ConfirmationModal.jsx';
import Pagination from '../../../components/Pagination.jsx';
// Função utilitária para deduplicar por id
function deduplicateById(arr) {
  const seen = new Set();
  return arr.filter(item => {
    if (!item || !item.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const AddButton = styled(Link)`
  background-color: #9dd9d2;
  color: #1a202c;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  &:hover {
    background-color: #86c7bf;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;
const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;
const SortContainer = styled.div`
  display: flex;
  gap: 1rem;
`;
const SortButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  background-color: ${({ $active }) => ($active ? '#9dd9d2' : '#2d3748')};
  color: ${({ $active }) => ($active ? '#1a202c' : '#a0aec0')};
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  &:hover {
    border-color: #9dd9d2;
    color: #fff;
  }
`;
const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const ViewButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$active',
})`
  background-color: ${({ $active }) => ($active ? '#9dd9d2' : '#2d3748')};
  color: ${({ $active }) => ($active ? '#1a202c' : '#a0aec0')};
  border: 1px solid #4a5568;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    border-color: #9dd9d2;
    color: #fff;
  }
`;
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;
const ListContainer = styled.div`
  background-color: #2d3748;
  border-radius: 15px;
  overflow: hidden;
`;

const ProdutosPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [viewMode, setViewMode] = useState('grid');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsService.getAllProducts(currentPage, sortConfig);
      setProducts(response.data.data);
      setPaginationInfo({
        currentPage: response.data.current_page,
        totalPages: response.data.last_page,
      });
    } catch (err) {
      setError('Não foi possível carregar os produtos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortConfig]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    // Exclusão otimista
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete));
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
    try {
      await productsService.deleteProductById(productToDelete);
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Erro ao excluir o produto:', err);
      setError('Erro ao excluir o produto.');
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  // Remove duplicados de produtos por id
  const uniqueProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    // Deduplicação robusta por id
    return deduplicateById(products);
  }, [products]);

  const productList = useMemo(() =>
    uniqueProducts.map((product, idx) =>
      viewMode === 'grid' ? (
        <ProductCard key={`prod-${product.id ?? idx}`} product={product} onDelete={handleDeleteProduct} idx={idx} />
      ) : (
          <ProductListItem key={`prod-${product.id ?? idx}`} product={product} onDelete={handleDeleteProduct} idx={idx} />
        )
    ),
    [uniqueProducts, viewMode]
  );

  const renderContent = () => {
    if (loading) return <p>Carregando produtos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (uniqueProducts.length === 0) return <p>Nenhum produto encontrado.</p>;
    return viewMode === 'grid' ? <ProductGrid>{productList}</ProductGrid> : <ListContainer>{productList}</ListContainer>;
  };

  return (
    <div>
      <PageHeader>
        <div>
          <h1>Catálogo de Produtos</h1>
          <p>Adicione, edite e gerencie seus produtos.</p>
        </div>
        <AddButton to="/produtos/novo">
          <FaPlus /> Adicionar Novo Produto
        </AddButton>
      </PageHeader>
      <Toolbar>
        <SortContainer>
          <SortButton onClick={() => requestSort('id')} $active={sortConfig.key === 'id'}>
            Ordenar por ID
            {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
          </SortButton>
          <SortButton onClick={() => requestSort('name')} $active={sortConfig.key === 'name'}>
            Ordenar por Nome
            {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
          </SortButton>
        </SortContainer>
        <ViewToggle>
          <ViewButton onClick={() => setViewMode('grid')} $active={viewMode === 'grid'} title="Visualização em Grade">
            <FaTh />
          </ViewButton>
          <ViewButton onClick={() => setViewMode('list')} $active={viewMode === 'list'} title="Visualização em Lista">
            <FaList />
          </ViewButton>
        </ViewToggle>
      </Toolbar>

      {renderContent()}

      {paginationInfo && paginationInfo.totalPages > 1 && (
        <Pagination
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={executeDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default ProdutosPage;
