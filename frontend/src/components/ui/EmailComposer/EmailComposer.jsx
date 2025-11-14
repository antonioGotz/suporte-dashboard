import React, { useState, useCallback, useEffect } from 'react';
import {
  ComposerContainer,
  Card,
  Header,
  Title,
  Subtitle,
  Content,
  Field,
  FormGrid,
  InfoCard,
  InfoTitle,
  InfoBody,
  Pill,
  SelectGlobalStyles,
} from './EmailComposer.styles';

import RecipientSearch from './RecipientSearch';
import TemplateSelect from './TemplateSelect';
import SubjectInput from './SubjectInput';
import MessageEditor from './MessageEditor';
import AttachmentDropzone from './AttachmentDropzone';
import ComposerFooter from './ComposerFooter';
import MessagePreview from './MessagePreview';
import DOMPurify from 'dompurify';
import api from '../../../services/api';
import { replacePlaceholders, validarEmail, validarAnexos } from './EmailComposer.utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// mock templates (exemplos temporários)
const MOCK_TEMPLATES = [
  {
    id: 'welcome',
    name: 'Boas-vindas',
    cause: 'Boas-vindas ao serviço',
    subject: 'Bem-vindo(a), {{name}}!',
    body: '<p>Olá {{name}},<br/>Seja bem-vindo(a)! Estamos felizes em tê-lo(a) conosco. Se tiver qualquer dúvida, responda este e-mail.</p>'
  },
  {
    id: 'promo',
    name: 'Promoção',
    cause: 'Oferta comercial',
    subject: 'Oferta especial para {{name}} — até {{discount}} de desconto',
    body: '<p>Olá {{name}},<br/>Preparamos uma oferta exclusiva: aproveite <strong>{{discount}}</strong> em produtos selecionados. Use o código <em>PROMO{{date}}</em> na finalização.</p>'
  },
  {
    id: 'recuperacao',
    name: 'Recuperação de carrinho',
    cause: 'Lembrete de carrinho abandonado',
    subject: 'Você esqueceu algo no carrinho, {{name}}?',
    body: '<p>Olá {{name}},<br/>Percebemos que você deixou itens no carrinho. Volte para finalizar sua compra — temos estoque limitado.</p>'
  },
  {
    id: 'conf_pagamento',
    name: 'Confirmação de Pagamento',
    cause: 'Comprovante / confirmação',
    subject: 'Pagamento recebido — Pedido #{{order_id}}',
    body: '<p>Olá {{name}},<br/>Recebemos seu pagamento referente ao pedido <strong>#{{order_id}}</strong>. Em breve enviaremos o comprovante e atualizaremos o status da entrega.</p>'
  },
  {
    id: 'newsletter',
    name: 'Newsletter Mensal',
    cause: 'Comunicação geral',
    subject: 'Novidades deste mês — {{month}}',
    body: '<h3>Olá {{name}},</h3><p>Confira as principais novidades e artigos do mês. Temos dicas, lançamentos e casos de sucesso para você.</p>'
  },
  {
    id: 'evento',
    name: 'Convite para evento',
    cause: 'Evento / Webinar',
    subject: 'Convite: Participe do nosso evento em {{date}}',
    body: '<p>Olá {{name}},<br/>Gostaríamos de convidá-lo(a) para o evento <strong>Nome do Evento</strong> em <em>{{date}}</em>. Inscreva-se pelo link e garanta sua vaga.</p>'
  },
  {
    id: 'suporte',
    name: 'Resposta do Suporte',
    cause: 'Atendimento ao cliente',
    subject: 'Atualização sobre seu chamado #{{ticket}}',
    body: '<p>Olá {{name}},<br/>Atualizamos o status do seu chamado <strong>#{{ticket}}</strong>. Nossa equipe avaliou e informou as próximas etapas.</p>'
  }
];

const EmailComposer = () => {
  const [theme] = useState(() => {
    try {
      return localStorage.getItem('email_theme') || 'graphite';
    } catch {
      return 'graphite';
    }
  });

  useEffect(() => {
    try { localStorage.setItem('email_theme', theme); } catch {}
  }, [theme]);
  const [recipient, setRecipient] = useState(null);
  const [template, setTemplate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // react-select option object
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  // comport. padrão: anexar ao corpo (append)
  const [lastAddedTemplateId, setLastAddedTemplateId] = useState(null);
  const [lastTemplateAction, setLastTemplateAction] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // altura fixa do editor (padrão 300px)

  const handleSelectRecipient = useCallback((user) => {
    console.debug('EmailComposer handleSelectRecipient:', user);
    setRecipient(user);
  }, []);

  const handleSelectTemplate = useCallback((tpl) => {
    setTemplate(tpl);
    if (!tpl) return;
    // Novo comportamento: SUBSTITUIR (set) o conteúdo do editor com o template selecionado.
    // Montar dados para substituição de placeholders usando informações já presentes no composer.
    const name = recipient?.name ?? '';
    // Tentar extrair order_id do assunto (por exemplo: "Pedido #123" ou "#123")
    const orderMatch = String(subject || '').match(/#(\d+)/);
    const order_id = orderMatch ? orderMatch[1] : '';
    const data = { name, order_id };

    const newBodyPart = replacePlaceholders(tpl.body, data) || '';
    // Substitui completamente o conteúdo do editor
    setBody(newBodyPart);

    // atualizar estado de controle de template
    setLastAddedTemplateId(tpl.id);
    setLastTemplateAction('set');
    toast.info('Template aplicado ao corpo da mensagem');

    // atualiza o assunto com placeholders substituídos (mantemos comportamento atual)
    setSubject(replacePlaceholders(tpl.subject, data));
  }, [recipient, lastAddedTemplateId, lastTemplateAction]);

  // map templates to react-select options (memoized)
  const options = React.useMemo(() => (
    MOCK_TEMPLATES.map(t => ({ value: t.id, label: t.name, raw: t }))
  ), []);

  // handler que recebe a option do TemplateSelect e converte para o template original
  const handleTemplateSelectChange = useCallback((option) => {
    setSelectedOption(option || null);
    if (!option) {
      setTemplate(null);
      return;
    }
  const tpl = (option.raw ?? MOCK_TEMPLATES.find(x => String(x.id) === String(option.value))) || null;
    // reaproveita a lógica existente
    handleSelectTemplate(tpl);
  }, [handleSelectTemplate]);

  const handleAddAttachments = useCallback((files) => {
    setAttachments((prev) => [...prev, ...files]);
  }, []);

  const handleRemoveAttachment = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSend = useCallback(() => {
    if (!recipient || !validarEmail(recipient.email)) {
      toast.error('Selecione um destinatário válido');
      return;
    }
    const an = validarAnexos(attachments);
    if (!an.valid) {
      toast.error('Problema com anexos: ' + an.reason);
      return;
    }
    setShowPreview(true);
  }, [recipient, attachments]);

  const confirmSend = useCallback(() => {
    setShowPreview(false);
    setIsSending(true);
    const safeBody = DOMPurify.sanitize(body || '');
    setTimeout(() => {
      setIsSending(false);
      console.debug('Simulated send payload:', { recipient, subject, body: safeBody, attachments });
      toast.success('E-mail enviado (simulado)');
      setRecipient(null);
  setTemplate(null);
  setSelectedOption(null);
      setSubject('');
      setBody('');
      setAttachments([]);
    }, 1000);
  }, []);

  // Atalho de teclado: Ctrl/Cmd + Enter para enviar (abrir prévia)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isSending) handleSend();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [isSending, handleSend]);

  // Busca real de destinatários via axios central: assinantes (admin)
  const fetchRecipients = useCallback(async (q) => {
    const query = String(q || '').trim();
    if (!query) return [];
    try {
      // Debug: registrar a query e a resposta da API para diagnóstico
      // eslint-disable-next-line no-console
      console.debug('[EmailComposer] fetchRecipients - query:', query);
      const res = await api.get('/admin/subscribers/search', { params: { q: query } });
      // eslint-disable-next-line no-console
      console.debug('[EmailComposer] fetchRecipients - response:', res && res.status, res && res.data);
      const data = res?.data;
      const arr = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
      // eslint-disable-next-line no-console
      console.debug('[EmailComposer] fetchRecipients - normalized array length:', Array.isArray(arr) ? arr.length : 0);
      return arr.map((r) => ({
        id: r.id ?? r.user_id ?? r.uuid ?? r.value ?? null,
        name: r.name ?? r.full_name ?? r.label ?? r.email ?? '-',
        email: r.email ?? r.mail ?? '',
      }));
    } catch (err) {
      // Tratamento explícito para erros de autenticação/autorizaçao:
      const status = err?.response?.status;
      // eslint-disable-next-line no-console
      console.debug('[EmailComposer] fetchRecipients - error status:', status, err?.response?.data || err.message);
      if (status === 401 || status === 419) {
        toast.error('Sessão expirada. Por favor faça login novamente.');
        // eslint-disable-next-line no-console
        console.debug('EmailComposer recipients search unauthorized (401/419)');
        return [];
      }
      if (status === 403) {
        toast.error('Acesso negado: você não tem permissão para buscar assinantes.');
        // eslint-disable-next-line no-console
        console.debug('EmailComposer recipients search forbidden (403)');
        return [];
      }
      // Para outros erros, logue e retorne vazio para não quebrar o autocomplete.
      // eslint-disable-next-line no-console
      console.debug('EmailComposer recipients protected search failed:', err);
      return [];
    }
  }, []);

  return (
    <>
      {/* Global styles for react-select used inside the composer */}
      <SelectGlobalStyles />
      <ToastContainer />
      <ComposerContainer data-theme={theme}>
      <Card>
        <Header>
          <Title>Email Composer</Title>
          <Subtitle>Crie e envie e-mails com facilidade usando busca inteligente e templates.</Subtitle>
        </Header>
        <Content>
          <FormGrid>
            <Field>
              <RecipientSearch
                value={recipient}
                onChange={handleSelectRecipient}
                fetchRecipients={fetchRecipients}
                minLength={2}
              />
            </Field>
            <Field>
              <SubjectInput value={subject} onChange={(v) => setSubject(v)} />
            </Field>
            <Field>
              <TemplateSelect
                options={options}
                value={selectedOption}
                onChange={handleTemplateSelectChange}
              />
            </Field>
            {/* controles de modo e altura removidos conforme solicitado */}
          </FormGrid>

          {template && (
            <Field>
              <InfoCard>
                <InfoTitle>
                  <Pill>Motivo</Pill>
                  &nbsp;{template.cause}
                </InfoTitle>
                <InfoBody>
                  <em>Mensagem modelo:</em>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(template.body) }} />
                </InfoBody>
              </InfoCard>
            </Field>
          )}

          <Field>
            <MessageEditor value={body} onChange={(v) => setBody(v)} />
          </Field>

          <Field>
            <AttachmentDropzone attachments={attachments} onAdd={handleAddAttachments} onRemove={handleRemoveAttachment} />
          </Field>

          <ComposerFooter onSend={handleSend} isSending={isSending} />
        </Content>
      </Card>
      </ComposerContainer>

      {showPreview && (
        <MessagePreview html={body} onClose={() => setShowPreview(false)} onConfirm={confirmSend} />
      )}
    </>
  );
};

export default EmailComposer;
