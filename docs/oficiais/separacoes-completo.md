# Módulo de Separações — Guia Completo

## 1. História e Propósito

O módulo de separações é o cérebro logístico do sistema. Ele garante que cada assinante receba o produto certo, no momento certo, no endereço correto, com rastreabilidade total. Automatiza o fluxo mensal de remessas, sugere brinquedos, valida endereços, gera etiquetas e registra todas as ações.

## 2. Estrutura do Banco de Dados

### Tabelas Principais

- **orders**
  - id, users_id, products_id, status, separation_status, label_status, label_canceled_at, timestamps
- **actions_log**
  - id, order_id, user_id, action, reason, action_by, created_at
- **users**
  - id, name, email, phone, document, endereço completo
- **children**
  - id, user_id, name, birth
- **products**
  - id, name, plan_vindi

### Relacionamentos

- users → orders (um para muitos)
- users → children (um para muitos)
- orders → actions_log (um para muitos)
- orders → products (muitos para um)

## 3. Endpoints Backend

- `GET /api/admin/separation` — Lista pedidos para separação
- `POST /api/admin/orders/{order}/shipping/label` — Gera etiqueta
- `PUT|PATCH /api/admin/separation/{order}` — Atualiza status
- `GET /api/admin/shipping/labels/recent` — Histórico de etiquetas
- `GET /api/admin/subscribers/{id}` — Dados detalhados do assinante

## 4. Lógicas e Validações

- Seleção de pedidos: status ativo, próxima remessa em até 15 dias
- Cálculo de idade do bebê, sugestão de brinquedo
- Validação de endereço (pedido > usuário)
- Registro de ações no histórico
- Bloqueios por status e idempotência
- Mensagens de erro: sempre retornar JSON com `message` e `errors` (se aplicável)

## 5. Frontend — Layout e Componentes

### Bibliotecas Sugeridas

- React, Axios, React Table, React Modal, React Hook Form, Day.js/date-fns

### Componentes Reutilizáveis

- `SeparationList.jsx`: Lista principal de separações (tabela)
- `SeparationFilters.jsx`: Filtros de busca e seleção
- `SeparationActions.jsx`: Botões de ação (gerar etiqueta, detalhes)
- `SeparationDetailsModal.jsx`: Modal com detalhes do pedido/assinante
- `SeparationHistory.jsx`: Página/tabela de histórico de separações
- `UserAddress.jsx`: Exibe endereço do usuário/pedido
- `ChildInfo.jsx`: Exibe dados do(s) filho(s)

### Exemplo de Tabela

| Assinante | E-mail | Plano | Idade Bebê | Próxima Remessa | Status | Separação | Endereço | Brinquedo | Ações |
|-----------|--------|-------|------------|-----------------|--------|-----------|----------|-----------|-------|
| Maria     | ...    | Bebê  | 11 meses   | 10/11/2025      | Ativo  | Aguardando| ...      | Cubo      | [Gerar Etiqueta] [Detalhes] |

### Exemplo de Código

```jsx
// SeparationList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SeparationFilters from './SeparationFilters';
import SeparationActions from './SeparationActions';
import SeparationDetailsModal from './SeparationDetailsModal';

export default function SeparationList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/separation').then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <SeparationFilters />
      <table>
        <thead>
          <tr>
            <th>Assinante</th>
            <th>Plano</th>
            <th>Idade Bebê</th>
            <th>Próxima Remessa</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.user.name}</td>
              <td>{order.product.name}</td>
              <td>{order.baby_age_months} meses</td>
              <td>{order.next_shipment_date}</td>
              <td>{order.separation_status}</td>
              <td>
                <SeparationActions order={order} onDetails={() => setSelectedOrder(order)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <SeparationDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
```

```jsx
// SeparationActions.jsx
import React from 'react';
import axios from 'axios';

export default function SeparationActions({ order, onDetails }) {
  const handleGenerateLabel = () => {
    axios.post(`/api/admin/orders/${order.id}/shipping/label`)
      .then(() => alert('Etiqueta gerada!'))
      .catch(err => alert('Erro ao gerar etiqueta'));
  };

  return (
    <>
      <button onClick={onDetails}>Detalhes</button>
      <button onClick={handleGenerateLabel} disabled={order.separation_status !== 'Aguardando Separação'}>
        Gerar Etiqueta
      </button>
    </>
  );
}
```

```jsx
// SeparationDetailsModal.jsx
import React from 'react';
import UserAddress from './UserAddress';
import ChildInfo from './ChildInfo';

export default function SeparationDetailsModal({ order, onClose }) {
  return (
    <div className="modal">
      <h2>Detalhes do Pedido</h2>
      <p>Assinante: {order.user.name}</p>
      <UserAddress address={order.user} />
      <ChildInfo child={order.latest_child} />
      <button onClick={onClose}>Fechar</button>
    </div>
  );
}
```

```jsx
// SeparationHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SeparationHistory() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/shipping/labels/recent').then(res => setLogs(res.data.data));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Assinante</th>
          <th>Ação</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log.id}>
            <td>{log.order.id}</td>
            <td>{log.order.user.name}</td>
            <td>{log.action}</td>
            <td>{log.created_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 6. Integração Front x Back

- Use `axios` com baseURL configurada para `/api/admin`
- Adicione interceptors para tratar erros globais e autenticação
- Exemplo:
  ```js
  import axios from 'axios';
  const api = axios.create({ baseURL: '/api/admin' });
  api.interceptors.response.use(
    res => res,
    err => {
      alert(err.response?.data?.message || 'Erro inesperado');
      return Promise.reject(err);
    }
  );
  export default api;
  ```

## 7. Testes

- Backend: use PHPUnit para controllers e models
- Frontend: use Jest + React Testing Library para componentes e integração
- Exemplo de teste frontend:
  ```js
  import { render, screen } from '@testing-library/react';
  import SeparationList from './SeparationList';
  test('exibe tabela de separações', () => {
    render(<SeparationList />);
    expect(screen.getByText('Assinante')).toBeInTheDocument();
  });
  ```

## 8. Deploy

- Backend:
  - Rodar migrations: `php artisan migrate`
  - Configurar variáveis de ambiente (.env)
- Frontend:
  - Build: `npm run build`
  - Configurar variáveis de ambiente (ex: VITE_API_URL)
  - Deploy dos arquivos estáticos

## 9. Observações Finais

- Mensagens de erro e validações devem ser claras para o usuário
- Layout responsivo: use CSS-in-JS ou frameworks como Tailwind/Bootstrap
- Documentação de endpoints e exemplos de payloads ajudam na integração

---

Se quiser, posso salvar esse conteúdo em um arquivo do projeto para você!