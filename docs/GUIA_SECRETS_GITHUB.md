# Guia: Como Configurar Secrets SSH no GitHub Actions

Este guia explica onde encontrar e como configurar os valores necessários para os GitHub Actions funcionarem.

## 📍 Onde Configurar os Secrets

1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret** para cada secret abaixo

---

## 🔑 Secrets Necessários

### 1. **SSH_HOST** (Host do Servidor)

**Onde encontrar:**
- No **cPanel** do HostGator, vá em **Informações da Conta** ou **Account Information**
- Procure por **"Server Name"** ou **"Hostname"**
- Também pode ser encontrado em **"FTP Accounts"** ou **"SSH Access"**
- Geralmente é algo como: `gator1234.hostgator.com` ou `server.aevolua.com.br`

**Exemplo:**
```
gator1234.hostgator.com
```

**OU** você pode usar o IP do servidor que aparece nas informações da conta.

---

### 2. **SSH_USERNAME** (Usuário SSH)

**Onde encontrar:**
- No **cPanel**, vá em **SSH Access** (ou **Acesso SSH**)
- O nome de usuário SSH geralmente é o **mesmo nome da sua conta cPanel**
- Baseado nos caminhos do projeto (`/home4/aevolu38/`), o usuário parece ser: `aevolu38`

**Como verificar:**
1. Acesse o cPanel
2. Vá em **SSH Access**
3. O nome de usuário aparece lá (geralmente é o mesmo do cPanel)

**Exemplo:**
```
aevolu38
```

---

### 3. **SSH_PORT** (Porta SSH - Opcional)

**Valor padrão:** `22`

**Onde encontrar:**
- No **cPanel**, vá em **SSH Access**
- A porta padrão é **22** na maioria dos casos
- Se não encontrar, use **22** (é o padrão)

**Nota:** Se você não configurar este secret, o workflow usará automaticamente a porta 22.

**Exemplo:**
```
22
```

---

### 4. **SSH_PRIVATE_KEY** (Chave Privada SSH)

**IMPORTANTE:** Esta é a parte mais crítica. Você precisa gerar um par de chaves SSH.

#### Opção A: Gerar uma Nova Chave SSH (Recomendado)

1. **No seu computador local (Windows):**

   Abra o PowerShell ou Git Bash e execute:

   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions-deploy"
   ```

   - Quando perguntado onde salvar, pressione Enter (salva em `C:\Users\SeuUsuario\.ssh\id_rsa`)
   - Quando perguntado pela senha, você pode deixar em branco ou criar uma

2. **Copiar a chave pública para o servidor:**

   ```bash
   # Copie o conteúdo do arquivo id_rsa.pub
   type C:\Users\SeuUsuario\.ssh\id_rsa.pub
   ```

   Ou no Git Bash:
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

3. **Adicionar a chave pública no servidor:**

   - Acesse o **cPanel** → **SSH Access**
   - Clique em **"Manage SSH Keys"** ou **"Gerenciar Chaves SSH"**
   - Clique em **"Import Key"** ou **"Importar Chave"**
   - Cole o conteúdo de `id_rsa.pub` (a chave pública)
   - Salve e autorize a chave

4. **Copiar a chave privada para o GitHub:**

   ```bash
   # No PowerShell
   type C:\Users\SeuUsuario\.ssh\id_rsa
   ```

   Ou no Git Bash:
   ```bash
   cat ~/.ssh/id_rsa
   ```

   **Copie TODO o conteúdo** (incluindo as linhas `-----BEGIN RSA PRIVATE KEY-----` e `-----END RSA PRIVATE KEY-----`)

5. **Cole no GitHub:**
   - No GitHub, crie um secret chamado `SSH_PRIVATE_KEY`
   - Cole o conteúdo completo da chave privada

#### Opção B: Se Você Já Tem uma Chave SSH

Se você já usa SSH para acessar o servidor:

1. Encontre sua chave privada (geralmente em `C:\Users\SeuUsuario\.ssh\id_rsa` ou `~/.ssh/id_rsa`)
2. Copie o conteúdo completo
3. Adicione no GitHub como `SSH_PRIVATE_KEY`

**IMPORTANTE:** 
- ✅ Use a **chave privada** (`id_rsa`) no GitHub
- ✅ Certifique-se de que a **chave pública** (`id_rsa.pub`) está autorizada no servidor
- ❌ NUNCA compartilhe sua chave privada publicamente

---

## 📝 Resumo dos Valores

Baseado no seu projeto, os valores provavelmente são:

| Secret | Valor Provável | Onde Encontrar |
|--------|---------------|----------------|
| `SSH_HOST` | `gator1234.hostgator.com` (ou IP) | cPanel → Account Information |
| `SSH_USERNAME` | `aevolu38` | cPanel → SSH Access |
| `SSH_PORT` | `22` | Padrão (ou cPanel → SSH Access) |
| `SSH_PRIVATE_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | Gerar localmente e copiar |

---

## ✅ Como Verificar se Está Funcionando

1. Configure todos os secrets no GitHub
2. Faça um push para a branch `main`
3. Vá em **Actions** no GitHub para ver o workflow executando
4. Se der erro, verifique os logs da Action para identificar o problema

---

## 🔒 Segurança

- ✅ Os secrets são **criptografados** pelo GitHub
- ✅ Apenas workflows do repositório podem acessá-los
- ✅ Ninguém consegue ver o valor dos secrets depois de configurados
- ❌ Nunca adicione secrets em arquivos de código ou commits

---

## 🆘 Troubleshooting

### Erro: "Permission denied (publickey)"
- Verifique se a chave pública está autorizada no servidor (cPanel → SSH Access → Manage SSH Keys)
- Certifique-se de que copiou a chave privada completa (com BEGIN e END)

### Erro: "Connection refused"
- Verifique se o `SSH_HOST` está correto
- Confirme se a porta `SSH_PORT` está correta (geralmente 22)
- Verifique se o SSH está habilitado no cPanel

### Erro: "Host key verification failed"
- Isso é normal na primeira execução
- O GitHub Actions deve lidar com isso automaticamente

---

## 📚 Links Úteis

- [Documentação GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Gerar chaves SSH no Windows](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [cPanel SSH Access](https://support.hostgator.com/articles/cpanel/how-to-use-ssh-access-in-cpanel)

