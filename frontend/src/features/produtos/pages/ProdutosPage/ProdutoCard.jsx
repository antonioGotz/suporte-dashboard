import React from 'react';
import * as S from './ProdutosPage.styles';

const ProdutoCard = ({ produto, onEdit, onDelete, formatCurrency }) => {
  return (
    <S.Card>
      <S.CardHeader>
        <S.CardTitle>{produto.name || produto.nome || 'Produto sem nome'}</S.CardTitle>
      </S.CardHeader>

      <S.CardBody>
        {produto.description && (
          <S.CardRow>
            <S.CardLabel>Descrição:</S.CardLabel>
            <S.CardValue>{produto.description || produto.descricao || '-'}</S.CardValue>
          </S.CardRow>
        )}

        {produto.price !== undefined && (
          <S.CardRow>
            <S.CardLabel>Valor:</S.CardLabel>
            <S.CardValueHighlight>{formatCurrency(produto.price || produto.valor || 0)}</S.CardValueHighlight>
          </S.CardRow>
        )}

        {produto.plan_vindi && (
          <S.CardRow>
            <S.CardLabel>Plano Vindi:</S.CardLabel>
            <S.CardValue>{produto.plan_vindi}</S.CardValue>
          </S.CardRow>
        )}
      </S.CardBody>

      <S.CardFooter>
        {onEdit && (
          <S.CardEditButton onClick={() => onEdit(produto.id)}>
            Editar
          </S.CardEditButton>
        )}
        {onDelete && (
          <S.CardDeleteButton onClick={() => onDelete(produto.id)}>
            Deletar
          </S.CardDeleteButton>
        )}
      </S.CardFooter>
    </S.Card>
  );
};

export default ProdutoCard;

