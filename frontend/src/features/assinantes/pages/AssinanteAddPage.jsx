// ARQUIVO: src/features/assinantes/pages/AssinanteAddPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import * as assinantesService from '../services/assinantesService';
import { getSubscriptionPlans } from '../../produtos/services/productsService';
import SuccessModal from '../../../components/SuccessModal.jsx';
import { getMaxOrderId } from '../../../services/ordersService';

// --- COMPONENTES ESTILIZADOS ---
const Form = styled.form`
  display: flex; flex-direction: column; gap: 1.2rem; max-width: 700px;
  background-color: var(--color-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
`;
const FormInput = styled.input`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--color-border);
  background-color: var(--color-background); color: #fff; font-size: 1rem; box-sizing: border-box;
  transition: all 0.2s ease;
  &:focus { border-color: var(--color-primary-ciano); box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.2); outline: none; }
`;
const FormSelect = styled.select`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--color-border);
  background-color: var(--color-background); color: #fff; font-size: 1rem; box-sizing: border-box;
  transition: all 0.2s ease;
  &:focus { border-color: var(--color-primary-ciano); box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.2); outline: none; }
`;
const FormActions = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
`;
const SubmitButton = styled.button`
  background-color: var(--color-primary-ciano); color: var(--color-card-bg); border: none; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
  &:disabled { background-color: #555; cursor: not-allowed; opacity: 0.7; }
  &:hover:not(:disabled) { filter: brightness(0.9); transform: translateY(-2px); }
`;
const CancelLink = styled(Link)`
  background-color: var(--color-border); color: #fff; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; text-decoration: none;
  &:hover { background-color: #718096; }
`;
const FormLabel = styled.label`
  font-weight: 600; margin-bottom: -0.5rem;
`;
// --- FIM DOS ESTILOS

const AssinanteAddPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ id: '', name: '', email: '', phone: '', document: '', plan_id: '' });
    const [idStatus, setIdStatus] = useState('');
    const [idValid, setIdValid] = useState(false);
    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [status, setStatus] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        getSubscriptionPlans()
            .then(response => {
                setPlans(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, plan_id: response.data[0].id }));
                }
            })
            .catch(err => console.error("Erro ao buscar planos:", err))
            .finally(() => setLoadingPlans(false));
        // Sugere automaticamente o próximo id disponível
        (async () => {
            try {
                const maxId = await getMaxOrderId();
                setFormData(prev => ({ ...prev, id: String(maxId + 1) }));
                setIdStatus('ID sugerido automaticamente.');
                setIdValid(true);
            } catch (e) {
                setIdStatus('Não foi possível sugerir ID automaticamente.');
                setIdValid(false);
            }
        })();
    }, []);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        if (name === 'id') {
            setIdStatus('Verificando...');
            setIdValid(false);
            if (!value || isNaN(Number(value))) {
                setIdStatus('ID deve ser um número.');
                setIdValid(false);
                return;
            }
            try {
                // Verifica se o ID já existe na tabela orders
                const res = await assinantesService.getAssinanteById(value);
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
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!idValid) {
            setStatus('Escolha um ID válido e disponível.');
            return;
        }
        setStatus('Salvando...');
        try {
            await assinantesService.createAssinante(formData);
            setIsSuccessModalOpen(true);
        } catch (err) {
            setStatus(err.response?.data?.message || 'Erro ao salvar o assinante.');
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1>Adicionar Novo Assinante</h1>
                <p>Preencha os dados abaixo para cadastrar manualmente.</p>
            </div>

            <Form onSubmit={handleFormSubmit}>
                <FormLabel>ID (manual)</FormLabel>
                <FormInput type="number" name="id" value={formData.id} onChange={handleInputChange} required min={1} step={1} />
                {formData.id && <p style={{ color: idValid ? 'green' : 'red', marginTop: '-1rem', marginBottom: '0.5rem' }}>{idStatus}</p>}
                <FormLabel>Nome Completo</FormLabel>
                <FormInput type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                <FormLabel>E-mail</FormLabel>
                <FormInput type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                <FormLabel>Telefone (Opcional)</FormLabel>
                <FormInput type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                <FormLabel>CPF (Opcional)</FormLabel>
                <FormInput type="text" name="document" value={formData.document} onChange={handleInputChange} />
                <FormLabel>Plano de Assinatura</FormLabel>
                {loadingPlans ? <p>Carregando planos...</p> : (
                    <FormSelect name="plan_id" value={formData.plan_id} onChange={handleInputChange} required>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>{plan.name} (R$ {plan.price})</option>
                        ))}
                    </FormSelect>
                )}
                {status && !status.includes('Salvando') && <p style={{ color: 'red' }}>{status}</p>}
                <FormActions>
                    <CancelLink to="/assinantes">Cancelar</CancelLink>
                    <SubmitButton type="submit" disabled={status.includes('Salvando')}>
                        {status.includes('Salvando') ? 'Salvando...' : 'Salvar Assinante'}
                    </SubmitButton>
                </FormActions>
            </Form>
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/assinantes');
                }}
                title="Sucesso!"
                message="Novo assinante criado com o status PENDENTE. Você já pode aprová-lo na lista."
            />
        </div>
    );
};

export default AssinanteAddPage;