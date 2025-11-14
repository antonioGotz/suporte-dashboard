import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as productsService from '../features/produtos/services/productsService';
import api from '../services/api';
import { getMaxOrderId } from '../services/ordersService';
import { createDemoSubscriber, mergeDemoSubscriberMetadata } from '../demo/demoSubscribersStore.js';

const PageWrap = styled.div`
  width: 100%;
  padding: 24px 12px 180px; /* espaço extra no fim para não cortar o botão */
  box-sizing: border-box;
  height: 100vh; /* ocupar a viewport inteira e permitir scroll interno */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* rolagem suave em iOS */
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;
const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 680px;
  margin: 16px auto;
  padding: 20px 16px;
  background: #0b1220;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  color: #e5e7eb;

  @media (min-width: 768px) {
    margin: 24px auto;
    padding: 28px 24px 22px;
  }
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Label = styled.label`
  font-weight: 600;
  margin-bottom: 4px;
`;
const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e5e7eb;
  width: 100%;
  &:focus { outline: none; border-color: #64748b; box-shadow: 0 0 0 2px rgba(100,116,139,.25); }
  &::placeholder { color: #94a3b8; }
  /* Corrige autofill do Chrome/Safari que deixa o fundo claro */
  &:-webkit-autofill,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:hover {
    -webkit-text-fill-color: #e5e7eb !important;
    box-shadow: 0 0 0px 1000px #1e293b inset !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }
  /* Outras correções úteis */
  &[type="date"] {
    color: #e5e7eb;
  }
  &::-webkit-calendar-picker-indicator {
    filter: invert(1) hue-rotate(180deg) brightness(0.9);
  }
`;
const Helper = styled.small`
  color: #94a3b8; display: block; margin-top: 4px;
`;
const Select = styled.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e5e7eb;
  width: 100%;
  &:focus { outline: none; border-color: #64748b; box-shadow: 0 0 0 2px rgba(100,116,139,.25); }
`;
const Button = styled.button`
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 12px;
  cursor: pointer;
  transition: background .15s;
  &:hover { background: #4f46e5; }
  &:disabled { opacity: .6; cursor: not-allowed; }
`;
const Error = styled.div`
  color: #ef4444;
  font-weight: 600;
  margin: 6px 0 0;
`;
const Success = styled.div`
  color: #22c55e;
  font-weight: 600;
  margin-bottom: 8px;
`;
const Info = styled.div`
  color: #fbbf24;
  font-weight: 600;
  margin-bottom: 8px;
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;

  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
`;

const FieldFull = styled.div`
  grid-column: 1 / -1;
`;

const initialState = {
  id: '',
  name: '',
  email: '',
  password: '',
  document: '',
  address: '',
  number: '',
  complete: '',
  neighborhood: '',
  city: '',
  state: '',
  cep: '',
  phone: '',
  date_birth: '',
  products_id: '',
  amount: '',
  child_name: '',
  child_birth: '',
};

export default function DemoSignupPage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [idStatus, setIdStatus] = useState('');
  const [idValid, setIdValid] = useState(false);
  const firstInputRef = useRef(null);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [profileLink, setProfileLink] = useState('');
  const suggestNextOrderId = useCallback(async () => {
    try {
      const maxId = await getMaxOrderId();
      setForm(prev => ({ ...prev, id: String(maxId + 1) }));
      setIdStatus('ID sugerido automaticamente.');
      setIdValid(true);
    } catch (e) {
      setIdStatus('Não foi possível sugerir ID automaticamente.');
      setIdValid(false);
    }
  }, [setForm, setIdStatus, setIdValid]);
  // Garante opções únicas e chaves estáveis no <select>
  const uniquePlans = React.useMemo(() => {
    const seen = new Set();
    return (plans || []).filter(p => {
      const id = String(p?.id ?? '');
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [plans]);

  useEffect(() => { firstInputRef.current?.focus(); }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPlans = async () => {
      try {
        let result = [];
        try {
          const res = await productsService.getSubscriptionPlans();
          const raw = res?.data?.data ?? res?.data;
          const listRaw = Array.isArray(raw) ? raw : [];
          result = listRaw.filter(item => item && item.id);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[DemoSignup] Fallback para lista completa de produtos.', err);
          const fallback = await productsService.getAllProducts(1, { key: 'name', direction: 'asc' });
          const rawFallback = fallback?.data?.data ?? fallback?.data;
          const listRaw = Array.isArray(rawFallback) ? rawFallback : [];
          result = listRaw.filter(item => item && item.id);
        }

        if (isMounted) {
          setPlans(result);
        }
      } catch (e) {
        if (isMounted) {
          console.warn('Falha ao carregar planos', e);
          setPlans([]);
        }
      } finally {
        if (isMounted) {
          setLoadingPlans(false);
        }
      }
    };

    loadPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    suggestNextOrderId();
  }, [suggestNextOrderId]);

  const maskDigits = (v) => v.replace(/\D+/g, '');
  const formatCep = (v) => {
    const d = maskDigits(v).slice(0,8);
    return d.length > 5 ? `${d.slice(0,5)}-${d.slice(5,8)}` : d;
  };
  const formatPhone = (v) => {
    const d = maskDigits(v).slice(0,11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  };
  const normalizeUF = (v) => v.toUpperCase().slice(0,2);

  const handleIdChange = async (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, id: value }));
    setIdStatus('Verificando...');
    setIdValid(false);
    if (!value || isNaN(Number(value))) {
      setIdStatus('ID deve ser um número.');
      setIdValid(false);
      return;
    }
    try {
      const res = await api.get(`/admin/orders/${value}`);
      if (res && res.data && res.data.id) {
        setIdStatus('ID já existe. Escolha outro.');
        setIdValid(false);
      } else {
        setIdStatus('ID disponível!');
        setIdValid(true);
      }
    } catch (err) {
      setIdStatus('ID disponível!');
      setIdValid(true);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'id') {
      handleIdChange(e);
      return;
    }
    let next = value;
    if (name === 'cep') next = formatCep(value);
    if (name === 'phone') next = formatPhone(value);
    if (name === 'state') next = normalizeUF(value);
    if (name === 'products_id') {
      const plan = plans.find(p => String(p.id) === String(value));
      if (plan && plan.price) {
        setForm(prev => ({ ...prev, products_id: value, amount: String(plan.price) }));
        return;
      }
    }
    setForm({ ...form, [name]: next });
  };

  const validate = (data) => {
    const errs = {};
    if (!data.id || Number.isNaN(Number(data.id)) || Number(data.id) <= 0) {
      errs.id = 'Informe um ID numérico válido.';
    }
    // Requisitos mínimos conforme DB: nome, email, senha
    if (!data.name || data.name.trim().length < 3) errs.name = 'Informe o nome completo (mín. 3).';
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'E-mail inválido.';
    if (!data.password || data.password.length < 6) errs.password = 'Senha mínima de 6 caracteres.';
    if (!data.phone || maskDigits(data.phone).length < 10) errs.phone = 'Telefone com DDD é obrigatório.';
    if (!data.address || data.address.trim().length < 5) errs.address = 'Endereço obrigatório.';
    if (!data.number || data.number.trim().length === 0) errs.number = 'Informe o número.';
    if (!data.neighborhood || data.neighborhood.trim().length < 3) errs.neighborhood = 'Informe o bairro.';
    if (!data.city || data.city.trim().length < 2) errs.city = 'Informe a cidade.';
    if (!data.state || data.state.trim().length !== 2) errs.state = 'UF com 2 letras.';
    if (!data.cep || maskDigits(data.cep).length !== 8) errs.cep = 'CEP deve ter 8 dígitos.';
    if (!data.child_name || data.child_name.trim().length < 2) errs.child_name = 'Nome da criança é obrigatório.';
    if (!data.child_birth) {
      errs.child_birth = 'Data de nascimento é obrigatória.';
    } else {
      const birthTs = Date.parse(data.child_birth);
      if (Number.isNaN(birthTs)) {
        errs.child_birth = 'Data de nascimento inválida.';
      } else if (birthTs > Date.now()) {
        errs.child_birth = 'Data de nascimento não pode ser futura.';
      }
    }
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProfileLink('');

    const hasOrderId = form.id && String(form.id).trim().length > 0;
    if (hasOrderId && !idValid) {
      setError('Escolha um ID válido e disponível.');
      return;
    }

    const errs = validate(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      return;
    }

    setLoading(true);
    try {
      const numericAmount = form.amount
        ? Number(String(form.amount).replace(',', '.'))
        : undefined;
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        document: maskDigits(form.document),
        phone: maskDigits(form.phone),
        cep: maskDigits(form.cep),
        address: form.address.trim(),
        number: form.number.trim(),
        complete: form.complete?.trim() || undefined,
  neighborhood: form.neighborhood.trim(),
  city: form.city.trim(),
  state: normalizeUF(form.state),
        date_birth: form.date_birth || undefined,
        products_id: form.products_id ? Number(form.products_id) : undefined,
        amount: Number.isFinite(numericAmount) ? numericAmount : undefined,
        child_name: form.child_name.trim(),
        child_birth: form.child_birth,
        order_id: hasOrderId ? Number(form.id) : undefined,
      };

      const response = await api.post('/demo/signup/full', payload);

      const selectedPlan = uniquePlans.find((p) => String(p.id) === String(form.products_id));
      const demoRecord = createDemoSubscriber({
        name: form.name,
        email: form.email,
        phone: maskDigits(form.phone),
        plan: selectedPlan?.slug || selectedPlan?.id || 'default',
        planLabel: selectedPlan?.name,
        childName: form.child_name,
        childAgeLabel: form.child_birth,
        notes: 'Criado via fluxo demo público.',
      });

      if (demoRecord && response?.data) {
        const meta = {};
        if (response.data.user_id) meta.backendUserId = String(response.data.user_id);
        if (response.data.order_id) meta.backendOrderId = String(response.data.order_id);
        if (response.data.child_id) meta.backendChildId = String(response.data.child_id);
        if (response.data.demo_request_id) meta.backendDemoRequestId = String(response.data.demo_request_id);
        const suggestedOrderId = response.data.suggested_order_id ?? payload.order_id;
        if (suggestedOrderId) meta.suggestedOrderId = String(suggestedOrderId);
        if (response.data.pending) meta.pending = true;
        if (Object.keys(meta).length > 0) {
          mergeDemoSubscriberMetadata(demoRecord.id, meta);
        }
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setProfileLink(`${origin}/demo-subscriber/${demoRecord.id}`);

      const createdOrderId = response?.data?.order_id;
      const pending = Boolean(response?.data?.pending);
      const suggestedOrderId = response?.data?.suggested_order_id ?? payload.order_id;
      if (pending) {
        setSuccess(`Solicitação enviada! Aprove no painel para gerar o pedido${suggestedOrderId ? ` #${suggestedOrderId}` : ''} e iniciar a separação real.`);
      } else if (createdOrderId) {
        setSuccess(`Cadastro concluído! Pedido #${createdOrderId} já está disponível no painel completo.`);
      } else {
        setSuccess('Cadastro concluído!');
      }

      setForm(initialState);
      setFieldErrors({});
      await suggestNextOrderId();
      firstInputRef.current?.focus();
    } catch (err) {
      const res = err?.response;
      if (res?.status === 422 && res?.data?.errors) {
        setFieldErrors(res.data.errors);
        setError('Corrija os campos destacados.');
      } else {
        setError(res?.data?.message || 'Erro ao cadastrar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Container>
      <Title>Cadastro Demonstrativo de Assinante</Title>
      {error && <Error>{error}</Error>}
      {success && <Success>{success}</Success>}
      {profileLink && (
        <Success style={{ color: '#38bdf8' }}>
          Link do seu painel: <a href={profileLink} style={{ color: '#bae6fd' }}>{profileLink}</a>
        </Success>
      )}
      <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
  <Info>Campos marcados com * são obrigatórios. A assinatura real só é criada depois que você aprovar a solicitação no painel principal.</Info>
        <GridContainer>
          <div>
            <Label htmlFor="id">ID (manual) *</Label>
            <Input id="id" name="id" type="number" value={form.id} onChange={handleChange} required min={1} step={1} />
            {form.id && <Helper style={{ color: idValid ? 'green' : 'red' }}>{idStatus}</Helper>}
            {fieldErrors.id && <Error role="alert">{fieldErrors.id}</Error>}
          </div>
          <div>
            <Label htmlFor="name">Nome completo *</Label>
            <Input id="name" autoComplete="name" ref={firstInputRef} name="name" value={form.name} onChange={handleChange} placeholder="Ex.: Maria Silva" aria-invalid={!!fieldErrors.name} />
            {fieldErrors.name && <Error role="alert">{fieldErrors.name}</Error>}
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" autoComplete="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" aria-invalid={!!fieldErrors.email} />
            {fieldErrors.email && <Error role="alert">{fieldErrors.email}</Error>}
          </div>
          <div>
            <Label htmlFor="password">Senha *</Label>
            <Input id="password" autoComplete="new-password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" aria-invalid={!!fieldErrors.password} />
            {fieldErrors.password && <Error role="alert">{fieldErrors.password}</Error>}
          </div>
          <div>
            <Label htmlFor="child_name">Nome do bebê *</Label>
            <Input id="child_name" name="child_name" value={form.child_name} onChange={handleChange} placeholder="Ex.: Sofia" aria-invalid={!!fieldErrors.child_name} />
            {fieldErrors.child_name && <Error role="alert">{fieldErrors.child_name}</Error>}
          </div>
          <div>
            <Label htmlFor="child_birth">Nascimento do bebê *</Label>
            <Input id="child_birth" name="child_birth" type="date" value={form.child_birth} onChange={handleChange} aria-invalid={!!fieldErrors.child_birth} />
            {fieldErrors.child_birth && <Error role="alert">{fieldErrors.child_birth}</Error>}
          </div>
          <div>
            <Label htmlFor="document">CPF (opcional)</Label>
            <Input id="document" autoComplete="off" name="document" value={form.document} onChange={handleChange} placeholder="Somente números" aria-invalid={!!fieldErrors.document} />
          </div>
          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input id="phone" autoComplete="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(11) 98888-7777" aria-invalid={!!fieldErrors.phone} />
            {fieldErrors.phone && <Error role="alert">{fieldErrors.phone}</Error>}
          </div>
          <div>
            <Label htmlFor="date_birth">Data de nascimento</Label>
            <Input id="date_birth" autoComplete="bday" name="date_birth" type="date" value={form.date_birth} onChange={handleChange} aria-invalid={!!fieldErrors.date_birth} />
            {fieldErrors.date_birth && <Error role="alert">{fieldErrors.date_birth}</Error>}
          </div>
          <FieldFull>
            <Label>Endereço *</Label>
            <Input id="address" autoComplete="address-line1" name="address" value={form.address} onChange={handleChange} placeholder="Rua, avenida, etc" aria-invalid={!!fieldErrors.address} />
            {fieldErrors.address && <Error role="alert">{fieldErrors.address}</Error>}
          </FieldFull>
          <div>
            <Label>Número *</Label>
            <Input id="number" autoComplete="address-line2" name="number" value={form.number} onChange={handleChange} placeholder="123" aria-invalid={!!fieldErrors.number} />
            {fieldErrors.number && <Error role="alert">{fieldErrors.number}</Error>}
          </div>
          <div>
            <Label htmlFor="complete">Complemento</Label>
            <Input id="complete" autoComplete="address-line2" name="complete" value={form.complete} onChange={handleChange} />
            <Helper>Opcional: apto, bloco, referência…</Helper>
          </div>
          <div>
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input id="neighborhood" autoComplete="off" name="neighborhood" value={form.neighborhood} onChange={handleChange} aria-invalid={!!fieldErrors.neighborhood} />
            {fieldErrors.neighborhood && <Error role="alert">{fieldErrors.neighborhood}</Error>}
          </div>
          <div>
            <Label htmlFor="city">Cidade *</Label>
            <Input id="city" autoComplete="address-level2" name="city" value={form.city} onChange={handleChange} aria-invalid={!!fieldErrors.city} />
            {fieldErrors.city && <Error role="alert">{fieldErrors.city}</Error>}
          </div>
          <div>
            <Label htmlFor="state">Estado *</Label>
            <Input id="state" autoComplete="address-level1" name="state" value={form.state} onChange={handleChange} placeholder="UF" aria-invalid={!!fieldErrors.state} />
            {fieldErrors.state && <Error role="alert">{fieldErrors.state}</Error>}
          </div>
          <FieldFull>
            <Label htmlFor="cep">CEP *</Label>
            <Input id="cep" autoComplete="postal-code" name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" aria-invalid={!!fieldErrors.cep} />
            {fieldErrors.cep && <Error role="alert">{fieldErrors.cep}</Error>}
          </FieldFull>
        </GridContainer>
        <GridContainer>
          <div>
            <Label htmlFor="products_id">Plano (opcional)</Label>
            <Select id="products_id" autoComplete="off" name="products_id" value={form.products_id} onChange={handleChange} disabled={loadingPlans}>
              <option value="">Selecione um plano…</option>
              {uniquePlans.map((p, i) => (
                <option key={`${p.id}-${i}`} value={String(p.id)}>{p.name || `Plano #${p.id}`}</option>
              ))}
            </Select>
            <Helper>Selecione para sugerir um plano quando for aprovar pelo painel.</Helper>
          </div>
          <div>
            <Label htmlFor="amount">Valor (opcional)</Label>
            <Input id="amount" autoComplete="off" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" />
            <Helper>Deixe vazio para 0.00</Helper>
          </div>
        </GridContainer>
        <Button type="submit" disabled={loading || Object.keys(fieldErrors).length > 0} aria-busy={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
        {/* Spacer para garantir respiro no final em telas baixas */}
        <div style={{ height: 24 }} />
      </Form>
      </Container>
    </PageWrap>
  );
}

