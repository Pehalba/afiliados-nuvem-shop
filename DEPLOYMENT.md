# 🚀 Guia de Deployment - Plataforma de Afiliados

## Opções de Hospedagem

### 1. **GitHub Pages (Gratuito e Fácil)**

#### Passo a Passo:

1. **Criar repositório no GitHub:**

   ```bash
   # No terminal, na pasta do projeto
   git init
   git add .
   git commit -m "Primeira versão da plataforma de afiliados"
   ```

2. **Criar repositório no GitHub:**

   - Vá para [github.com](https://github.com)
   - Clique em "New repository"
   - Nome: `afiliados-nuvemshop`
   - Deixe público
   - Não inicialize com README

3. **Conectar e fazer push:**

   ```bash
   git remote add origin https://github.com/SEU_USUARIO/afiliados-nuvemshop.git
   git branch -M main
   git push -u origin main
   ```

4. **Ativar GitHub Pages:**

   - Vá para Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Salve

5. **Acessar:**
   - URL será: `https://SEU_USUARIO.github.io/afiliados-nuvemshop`

### 2. **Netlify (Gratuito e Automático)**

#### Opção A - Drag & Drop:

1. Vá para [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para a área de upload
3. Aguarde o deploy
4. URL será fornecida automaticamente

#### Opção B - GitHub Integration:

1. Conecte sua conta GitHub
2. Selecione o repositório
3. Deploy automático a cada push

### 3. **Vercel (Gratuito e Rápido)**

1. Vá para [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. Selecione o repositório
4. Deploy automático

### 4. **Firebase Hosting (Google)**

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init hosting

# Deploy
firebase deploy
```

### 5. **Servidor Local (Desenvolvimento)**

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## ⚠️ Configurações Importantes

### 1. **CORS para API da Nuvemshop**

Se hospedar em domínio diferente, pode precisar configurar CORS:

```javascript
// Em api.js, adicionar headers se necessário
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}
```

### 2. **HTTPS Obrigatório**

- GitHub Pages, Netlify, Vercel já fornecem HTTPS
- Importante para cookies e segurança

### 3. **Variáveis de Ambiente**

Para produção, considere usar:

- Netlify: Environment Variables
- Vercel: Environment Variables
- GitHub Pages: Usar localStorage (como está)

## 🎯 Recomendação

**Para começar rapidamente:**

1. **GitHub Pages** - Mais simples
2. **Netlify** - Mais recursos gratuitos
3. **Vercel** - Mais rápido

## 📋 Checklist de Deployment

- [ ] Testar localmente primeiro
- [ ] Verificar se todos os arquivos estão incluídos
- [ ] Testar login com dados demo
- [ ] Verificar responsividade
- [ ] Testar funcionalidades principais
- [ ] Configurar domínio personalizado (opcional)

## 🔧 Troubleshooting

### Problema: Página não carrega

**Solução:** Verificar se `index.html` está na raiz

### Problema: CSS não carrega

**Solução:** Verificar caminhos relativos nos arquivos

### Problema: API não funciona

**Solução:** Verificar CORS e credenciais

## 📞 Suporte

Se tiver problemas:

1. Verificar console do navegador (F12)
2. Testar localmente primeiro
3. Verificar se todos os arquivos foram enviados

---

**URL da sua plataforma será algo como:**

- GitHub Pages: `https://seu-usuario.github.io/afiliados-nuvemshop`
- Netlify: `https://random-name.netlify.app`
- Vercel: `https://afiliados-nuvemshop.vercel.app`
