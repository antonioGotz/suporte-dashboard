COMO RODAR LOCAL - MODO PROFISSIONAL

MÉTODO 1 - AUTOMÁTICO (RECOMENDADO)
1. Duplo clique em: dev-local.bat (na raiz do projeto)
2. Aguarde os 2 terminais abrirem automaticamente
3. Acesse: http://localhost:5173
4. Para parar: Feche os 2 terminais

MÉTODO 2 - MANUAL (se preferir)
Terminal 1 - Backend:
cd backend
dev-local.bat

Terminal 2 - Frontend:
cd frontend
dev-local.bat

IMPORTANTE:
- O arquivo .env de produção NUNCA é alterado permanentemente
- O dev-local.bat usa .env.local automaticamente
- Ao parar o servidor, .env volta ao normal
- NUNCA commite os arquivos dev-local.bat (já estão no gitignore)
- Login: use um email do banco real (ex: aevoluateste@aevolua.com)

SEGURANÇA:
✅ .env produção sempre protegido
✅ Impossível fazer deploy com config errada
✅ Sistema profissional usado por empresas grandes
