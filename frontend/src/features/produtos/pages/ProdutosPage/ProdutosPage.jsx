import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowUp, FaArrowDown, FaTh, FaList } from 'react-icons/fa';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import * as productsService from '../../services/productsService';
import ProductCard from '../../components/ProductCard.jsx';
import ProductListItem from '../../components/ProductListItem.jsx';
import ConfirmationModal from '../../../../components/ConfirmationModal.jsx';
import Pagination from '../../../../components/Pagination.jsx';
import ProdutoCard from './ProdutoCard';
import * as S from './ProdutosPage.styles';
import { formatCurrency } from './ProdutosPage.utils';

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

const ProdutosPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);
  
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
      fetchProducts(); // Recarregar para garantir sincronização
    } catch (err) {
      console.error('Erro ao excluir o produto:', err);
      setError('Erro ao excluir o produto.');
      fetchProducts(); // Recarregar em caso de erro
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

  const handleEdit = (id) => {
    navigate(`/produtos/editar/${id}`);
  };

  // Remove duplicados de produtos por id
  const uniqueProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return deduplicateById(products);
  }, [products]);

  // Desktop: grid/list view
  const productList = useMemo(() =>
    uniqueProducts.map((product, idx) =>
      viewMode === 'grid' ? (
        <ProductCard key={`prod-${product.id ?? idx}`} product={product} onDelete={handleDeleteProduct} idx={idx} />
      ) : (
        <ProductListItem key={`prod-${product.id ?? idx}`} product={product} onDelete={handleDeleteProduct} idx={idx} />
      )
    ),
    [uniqueProducts, viewMode, handleDeleteProduct]
  );

  const renderContent = () => {
    if (loading) return <S.LoadingContainer>Carregando produtos...</S.LoadingContainer>;
    if (error) return <S.ErrorContainer>{error}</S.ErrorContainer>;
    if (uniqueProducts.length === 0) return <S.EmptyState>Nenhum produto encontrado.</S.EmptyState>;
    
    // Mobile: sempre cards
    if (isMobile) {
      return (
        <S.CardsContainer>
          {uniqueProducts.map((product, idx) => (
            <ProdutoCard
              key={`prod-${product.id ?? idx}`}
              produto={product}
              onEdit={handleEdit}
              onDelete={handleDeleteProduct}
              formatCurrency={formatCurrency}
            />
          ))}
        </S.CardsContainer>
      );
    }
    
    // Desktop: grid ou list conforme viewMode
    return viewMode === 'grid' ? (
      <S.ProductGrid>{productList}</S.ProductGrid>
    ) : (
      <S.ListContainer>{productList}</S.ListContainer>
    );
  };

  return (
    <S.Container>
      <S.PageHeader>
        <div>
          <S.Title>Catálogo de Produtos</S.Title>
          <S.Subtitle>Adicione, edite e gerencie seus produtos.</S.Subtitle>
        </div>
        <S.AddButton as={Link} to="/produtos/novo">
          <FaPlus /> Adicionar Novo Produto
        </S.AddButton>
      </S.PageHeader>
      
      <S.Toolbar>
        <S.SortContainer>
          <S.SortButton onClick={() => requestSort('id')} $active={sortConfig.key === 'id'}>
            Ordenar por ID
            {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
          </S.SortButton>
          <S.SortButton onClick={() => requestSort('name')} $active={sortConfig.key === 'name'}>
            Ordenar por Nome
            {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
          </S.SortButton>
        </S.SortContainer>
        <S.ViewToggle>
          <S.ViewButton onClick={() => setViewMode('grid')} $active={viewMode === 'grid'} title="Visualização em Grade">
            <FaTh />
          </S.ViewButton>
          <S.ViewButton onClick={() => setViewMode('list')} $active={viewMode === 'list'} title="Visualização em Lista">
            <FaList />
          </S.ViewButton>
        </S.ViewToggle>
      </S.Toolbar>

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
    </S.Container>
  );
};

export default ProdutosPage;

