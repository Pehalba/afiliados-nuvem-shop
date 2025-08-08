# 📚 Guia Completo do Postman - Para Iniciantes

## 🎯 O que é o Postman?

**Postman** é como um "navegador para APIs". Em vez de acessar sites, você testa APIs (como a da Nuvemshop).

## 🚀 Como Instalar

### 1. **Baixar o Postman**
- Vá para [postman.com](https://postman.com)
- Clique em **"Download the App"**
- Instale no seu computador

### 2. **Criar Conta**
- Abra o Postman
- Clique em **"Sign Up"**
- Use seu email do GitHub
- É **gratuito**!

## 🎯 Interface Básica

```
┌─────────────────────────────────────┐
│ POST | https://api.exemplo.com     │ ← URL da API
├─────────────────────────────────────┤
│ Headers | Body | Params | Tests    │ ← Abas
├─────────────────────────────────────┤
│ Headers:                            │
│ Authorization: Bearer token123      │
│ Content-Type: application/json      │
├─────────────────────────────────────┤
│ Body (JSON):                        │
│ {                                  │
│   "name": "teste",                 │
│   "value": 10                      │
│ }                                  │
├─────────────────────────────────────┤
│ Send                                │ ← Botão para enviar
└─────────────────────────────────────┘
```

## 🎯 Primeiro Teste - API da Nuvemshop

### **Passo 1: Criar Nova Requisição**

1. Abra o Postman
2. Clique em **"New"** → **"Request"**
3. Nome: `"Teste Nuvemshop"`
4. Clique **"Save"**

### **Passo 2: Configurar URL**

```
GET https://api.nuvemshop.com.br/v1/SEU_STORE_ID/store
```

**Substitua:**
- `SEU_STORE_ID` pelo ID da sua loja

### **Passo 3: Adicionar Headers**

Clique na aba **"Headers"** e adicione:

| Key | Value |
|-----|-------|
| `Authorization` | `Bearer SEU_TOKEN_AQUI` |
| `Content-Type` | `application/json` |

### **Passo 4: Enviar Requisição**

1. Clique em **"Send"**
2. Veja a resposta na parte inferior

## 🎯 Testando sua Plataforma de Afiliados

### **1. Teste de Conexão**

**URL:** `GET https://api.nuvemshop.com.br/v1/SEU_STORE_ID/store`

**Headers:**
```
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

**O que esperar:**
```json
{
  "id": 123456,
  "name": "Minha Loja",
  "domain": "minhaloja.com.br"
}
```

### **2. Listar Cupons Existentes**

**URL:** `GET https://api.nuvemshop.com.br/v1/SEU_STORE_ID/discount_coupons`

**Headers:** (mesmos de cima)

**O que esperar:**
```json
[
  {
    "id": 1,
    "name": "JOAO10",
    "code": "JOAO10",
    "value": 10,
    "type": "percent"
  }
]
```

### **3. Criar Novo Cupom**

**URL:** `POST https://api.nuvemshop.com.br/v1/SEU_STORE_ID/discount_coupons`

**Headers:**
```
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "TESTE20",
  "code": "TESTE20",
  "value": 20,
  "type": "percent",
  "minimum_amount": 50
}
```

## 🎯 Criando uma Coleção Completa

### **Passo 1: Nova Coleção**

1. Clique em **"New"** → **"Collection"**
2. Nome: `"Nuvemshop API"`
3. Descrição: `"API para plataforma de afiliados"`

### **Passo 2: Adicionar Variáveis**

1. Clique na coleção
2. Aba **"Variables"**
3. Adicione:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `store_id` | `123456` | `123456` |
| `access_token` | `seu_token_aqui` | `seu_token_aqui` |
| `base_url` | `https://api.nuvemshop.com.br/v1` | `https://api.nuvemshop.com.br/v1` |

### **Passo 3: Criar Requisições**

#### **1. Teste de Conexão**
- **Method:** GET
- **URL:** `{{base_url}}/{{store_id}}/store`
- **Headers:** `Authorization: Bearer {{access_token}}`

#### **2. Listar Cupons**
- **Method:** GET
- **URL:** `{{base_url}}/{{store_id}}/discount_coupons`
- **Headers:** `Authorization: Bearer {{access_token}}`

#### **3. Criar Cupom**
- **Method:** POST
- **URL:** `{{base_url}}/{{store_id}}/discount_coupons`
- **Headers:** `Authorization: Bearer {{access_token}}`
- **Body:**
```json
{
  "name": "{{$randomFullName}}10",
  "code": "{{$randomFullName}}10",
  "value": 10,
  "type": "percent"
}
```

#### **4. Listar Pedidos**
- **Method:** GET
- **URL:** `{{base_url}}/{{store_id}}/orders`
- **Headers:** `Authorization: Bearer {{access_token}}`

## 🎯 Como Usar com sua Plataforma

### **1. Testar antes de codificar**

Antes de usar no JavaScript, teste no Postman:

```javascript
// No seu código (api.js)
const response = await fetch('https://api.nuvemshop.com.br/v1/123456/discount_coupons', {
  headers: {
    'Authorization': 'Bearer seu_token',
    'Content-Type': 'application/json'
  }
});
```

**Primeiro teste no Postman:**
- URL: `GET https://api.nuvemshop.com.br/v1/123456/discount_coupons`
- Veja se funciona
- Copie para o código

### **2. Debug de problemas**

Se algo não funcionar:

1. **Teste no Postman primeiro**
2. **Compare com o código**
3. **Verifique headers e body**
4. **Veja mensagens de erro**

## 🎯 Exemplos Práticos

### **Exemplo 1: Criar cupom para afiliado**

**No Postman:**
```
POST https://api.nuvemshop.com.br/v1/123456/discount_coupons
Headers:
  Authorization: Bearer seu_token
  Content-Type: application/json

Body:
{
  "name": "MARIA15",
  "code": "MARIA15", 
  "value": 15,
  "type": "percent"
}
```

**Resposta esperada:**
```json
{
  "id": 123,
  "name": "MARIA15",
  "code": "MARIA15",
  "value": 15,
  "type": "percent"
}
```

### **Exemplo 2: Verificar pedido com cupom**

**No Postman:**
```
GET https://api.nuvemshop.com.br/v1/123456/orders/789
Headers:
  Authorization: Bearer seu_token
```

**Resposta esperada:**
```json
{
  "id": 789,
  "discount_coupon": {
    "id": 123,
    "name": "MARIA15",
    "code": "MARIA15"
  },
  "total": 100.00
}
```

## 🎯 Dicas Importantes

### **1. Sempre teste primeiro no Postman**
- É mais rápido que no código
- Você vê exatamente o que a API retorna
- Facilita debug

### **2. Use variáveis**
- Não coloque IDs/tokens direto na URL
- Use `{{store_id}}` e `{{access_token}}`
- Facilita manutenção

### **3. Salve exemplos**
- Crie uma requisição para cada endpoint
- Adicione comentários explicando
- Compartilhe com equipe

### **4. Teste diferentes cenários**
- Cupom válido
- Cupom inválido  
- Token expirado
- Store ID errado

## 🎯 Próximos Passos

### **1. Instale o Postman**
- Baixe em [postman.com](https://postman.com)
- Crie conta gratuita

### **2. Crie a coleção**
- Siga os passos acima
- Adicione suas credenciais da Nuvemshop

### **3. Teste todos os endpoints**
- Conexão básica
- Listar cupons
- Criar cupom
- Verificar pedidos

### **4. Use no desenvolvimento**
- Teste antes de codificar
- Debug problemas
- Documente APIs

## 🆘 Problemas Comuns

### **Erro 401 (Unauthorized)**
- Token expirado ou inválido
- Verifique se o token está correto

### **Erro 404 (Not Found)**
- URL incorreta
- Store ID errado
- Endpoint não existe

### **Erro 400 (Bad Request)**
- Body mal formatado
- Campos obrigatórios faltando
- Valores inválidos

---

**🎯 Agora você pode testar a API da Nuvemshop antes de usar no código!**
