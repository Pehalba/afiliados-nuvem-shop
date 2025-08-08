# 🎯 Plataforma de Afiliados - Nuvemshop

Uma plataforma completa para gerenciar afiliados e cupons de desconto integrada com a API da Nuvemshop.

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Configuração da API](#configuração-da-api)
- [Testando a Integração](#testando-a-integração)
- [Uso da Plataforma](#uso-da-plataforma)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## ✨ Funcionalidades

### 🎫 Gestão de Cupons

- ✅ Criação automática de cupons de desconto
- ✅ Integração com API da Nuvemshop
- ✅ Rastreamento de uso dos cupons
- ✅ Verificação de cupons de afiliados

### 👥 Gestão de Afiliados

- ✅ Cadastro e gestão de afiliados
- ✅ Códigos únicos para cada afiliado
- ✅ Comissões personalizadas
- ✅ Status ativo/inativo

### 📊 Dashboard Administrativo

- ✅ Visão geral das vendas
- ✅ Relatórios de comissões
- ✅ Estatísticas em tempo real
- ✅ Exportação de dados

### 👤 Dashboard do Afiliado

- ✅ Visualização de vendas pessoais
- ✅ Acompanhamento de comissões
- ✅ Links de afiliado personalizados
- ✅ QR Code para WhatsApp

### 🔗 Sistema de Tracking

- ✅ Rastreamento de referência via URL
- ✅ Cookies para persistência
- ✅ Conversão automática
- ✅ Verificação de cupons em pedidos

## 📁 Estrutura do Projeto

```
afiliados-platform/
├── index.html             # Página de login
├── admin.html             # Painel do administrador
├── dashboard.html         # Painel do afiliado
│
├── js/
│   ├── main.js            # Funções genéricas e autenticação
│   ├── tracking.js        # Sistema de rastreamento
│   ├── api.js             # Integração com API da Nuvemshop
│   ├── admin.js           # Dashboard do admin
│   └── dashboard.js       # Dashboard do afiliado
│
├── css/
│   └── style.css          # Estilos da plataforma
│
└── data/
    └── mock.json          # Dados de demonstração
```

## 🚀 Como Rodar Localmente

### 1. Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)
- Conta na Nuvemshop com acesso à API

### 2. Configuração da API da Nuvemshop

#### **Passo 1: Obter Credenciais**
1. Acesse [Nuvemshop Apps](https://www.tiendanube.com/apps)
2. Crie um novo app ou use um existente
3. Obtenha seu **Store ID** e **Access Token**

#### **Passo 2: Configurar o Sistema**
1. Abra o arquivo `js/config.js`
2. Substitua as credenciais:
   ```javascript
   STORE_ID: "SEU_STORE_ID_AQUI",
   ACCESS_TOKEN: "SEU_ACCESS_TOKEN_AQUI",
   ```

#### **Passo 3: Testar a Integração**
1. Abra `test-api-integration.html` no navegador
2. Clique em "Testar Conexão"
3. Verifique se a API está funcionando

### 3. Instalação

#### Opção A: Scripts Automáticos (Recomendado)

**Windows:**

```bash
# Duplo clique no arquivo deploy.bat
# Ou no terminal:
deploy.bat
```

**Linux/Mac:**

```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar
./deploy.sh
```

### 4. Testando com Postman

Para testar a API antes de usar no sistema:

1. **Instale o Postman** em [postman.com](https://postman.com)
2. **Importe a coleção** `postman-collection.json`
3. **Configure as variáveis:**
   - `store_id`: Seu Store ID
   - `access_token`: Seu Access Token
4. **Teste os endpoints:**
   - Teste de Conexão
   - Listar Cupons
   - Criar Cupom
   - Listar Pedidos

Veja o guia completo em `POSTMAN-GUIDE.md`

#### Opção B: Servidor Local Manual

```bash
# Usando Python 3
python -m http.server 8000

# Ou usando Node.js (se tiver instalado)
npx http-server

# Ou usando PHP
php -S localhost:8000
```

#### Opção C: Abrir Diretamente

Simplesmente abra o arquivo `index.html` no navegador.

### 3. Acessando a Plataforma

**Local:** http://localhost:8000

### 4. 🌐 Deployment Online

Para disponibilizar sua plataforma na web, consulte o arquivo `DEPLOYMENT.md` que contém instruções detalhadas para:

- **GitHub Pages** (Gratuito e fácil)
- **Netlify** (Gratuito e automático)
- **Vercel** (Gratuito e rápido)
- **Firebase Hosting** (Google)

**Recomendação:** Comece com GitHub Pages para simplicidade.

- Abra seu navegador
- Acesse: `http://localhost:8000` (se usando servidor) ou abra `index.html`
- Use as credenciais de demonstração

## 🔧 Configuração da API

### 1. Obter Credenciais da Nuvemshop

1. Acesse sua conta Nuvemshop
2. Vá em **Configurações > API**
3. Crie um novo token de acesso
4. Anote o **Store ID** e **Access Token**

### 2. Configurar na Plataforma

1. Faça login como administrador
2. Vá para **Configurações**
3. Preencha:
   - **Store ID**: Seu ID da loja
   - **Access Token**: Seu token de acesso
   - **Comissão Padrão**: % padrão para novos afiliados

### 3. Testar Conexão

- Clique em **"Testar Conexão"**
- Se tudo estiver correto, aparecerá "Conectado"

## 🧪 Testando a Integração

### 1. Modo Demo

A plataforma funciona em modo demo por padrão. Para testar:

#### Credenciais de Teste:

- **Admin**: `admin@teste.com` / `senha123`
- **Afiliado**: `joao@teste.com` / `senha123`

### 2. Testando Criação de Cupons

1. Faça login como administrador
2. Vá para **Cupons**
3. Clique em **"+ Novo Cupom"**
4. Preencha os dados e salve
5. O cupom será criado automaticamente na Nuvemshop

### 3. Testando Tracking

1. Use um link de afiliado: `https://sua-loja.com?ref=JOAO10`
2. O sistema captura automaticamente o código do afiliado
3. Quando uma venda é feita com cupom, a comissão é atribuída

### 4. Verificando Comissões

1. Faça login como afiliado
2. Vá para **Minhas Comissões**
3. Veja as comissões geradas automaticamente

## 📖 Uso da Plataforma

### 👨‍💼 Painel Administrativo

#### Dashboard

- Visão geral das vendas
- Estatísticas de afiliados
- Atividade recente

#### Gestão de Afiliados

1. Clique em **"Afiliados"**
2. Clique em **"+ Novo Afiliado"**
3. Preencha os dados:
   - Nome e email
   - Código do afiliado (ex: JOAO10)
   - Comissão (%)
4. Salve - o cupom será criado automaticamente

#### Gestão de Cupons

1. Vá para **"Cupons"**
2. Veja todos os cupons criados
3. Clique em **"Sincronizar"** para atualizar da API

#### Relatórios de Vendas

1. Vá para **"Vendas"**
2. Use os filtros para buscar vendas específicas
3. Veja comissões geradas automaticamente

### 👤 Dashboard do Afiliado

#### Visão Geral

- Vendas do mês
- Comissões pendentes
- Taxa de conversão
- Gráficos de performance

#### Minhas Vendas

- Lista de todas as vendas
- Filtros por data e status
- Detalhes de cada venda

#### Meus Cupons

- Cupons ativos
- Códigos para compartilhar
- Estatísticas de uso

#### Links de Afiliado

- Links personalizados
- QR Code para WhatsApp
- Compartilhamento fácil

## 🛠️ Tecnologias Utilizadas

### Frontend

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Funcionalidades dinâmicas
- **DOM API**: Manipulação de elementos

### Integração

- **Fetch API**: Comunicação com APIs
- **LocalStorage**: Armazenamento local
- **Cookies**: Rastreamento de afiliados

### APIs

- **Nuvemshop API v1**: Gestão de cupons e pedidos
- **RESTful**: Endpoints padronizados

## 🔍 Funcionalidades Técnicas

### Sistema de Tracking

```javascript
// Captura automática de parâmetros
?ref=JOAO10&cupom=JOAO10

// Cookie persistente
afiliado_ref=JOAO10

// Verificação em pedidos
checkOrderAffiliateCoupon(orderId)
```

### Criação de Cupons

```javascript
// Payload para API
{
  "name": "JOAO10",
  "code": "JOAO10",
  "value": 10,
  "type": "percent"
}
```

### Verificação de Comissões

```javascript
// Extração de código de afiliado
extractAffiliateCode(couponName);

// Cálculo de comissão
commission = orderValue * (commissionRate / 100);
```

## 🚨 Observações Importantes

### ⚠️ Modo Demo

- A plataforma funciona em modo demo por padrão
- Dados são salvos no localStorage
- Para produção, configure a API real

### 🔒 Segurança

- Tokens da API devem ser protegidos
- Use HTTPS em produção
- Valide sempre os dados de entrada

### 📱 Responsividade

- Interface adaptada para mobile
- Teste em diferentes dispositivos
- Otimize para performance

## 🆘 Suporte

### Problemas Comuns

#### API não conecta

1. Verifique Store ID e Access Token
2. Teste a conexão na aba Configurações
3. Verifique se a API está ativa na Nuvemshop

#### Cupons não são criados

1. Verifique as permissões da API
2. Confirme se o código do cupom é único
3. Teste com dados mínimos primeiro

#### Tracking não funciona

1. Verifique se os parâmetros estão corretos
2. Teste o cookie no navegador
3. Confirme se o JavaScript está carregado

### Logs de Debug

Abra o Console do navegador (F12) para ver logs detalhados:

- `📊 Produto clicado`
- `🛒 Checkout iniciado`
- `💰 Conversão rastreada`
- `✅ Cupom criado`

## 📈 Próximos Passos

### Melhorias Sugeridas

- [ ] Banco de dados real (MySQL/PostgreSQL)
- [ ] Autenticação JWT
- [ ] Notificações em tempo real
- [ ] Relatórios avançados
- [ ] Integração com WhatsApp Business
- [ ] App mobile

### Integrações Futuras

- [ ] PIX para pagamentos
- [ ] Webhooks da Nuvemshop
- [ ] Analytics avançado
- [ ] Email marketing
- [ ] Redes sociais

---

**🎯 Plataforma de Afiliados - Nuvemshop**  
_Desenvolvido com ❤️ para facilitar a gestão de afiliados_
