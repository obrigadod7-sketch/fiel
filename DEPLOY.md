# 🚀 Guia de Deploy - Watizat

Este guia mostra como fazer deploy da aplicação Watizat no **Render** e **Railway**.

## 📋 Pré-requisitos

### 1. MongoDB Atlas (Banco de Dados)
- Crie uma conta gratuita em: https://www.mongodb.com/cloud/atlas
- Crie um cluster gratuito
- Obtenha sua Connection String (formato: `mongodb+srv://username:password@cluster.mongodb.net/watizat_db`)

### 2. Variáveis de Ambiente Necessárias
```
MONGO_URL=sua_connection_string_aqui
DB_NAME=watizat_db
JWT_SECRET=seu_secret_jwt_aqui
EMERGENT_LLM_KEY=sk-emergent-b8cEdA5822d14C0638
CORS_ORIGINS=*
```

---

## 🎯 Deploy no Render

### Opção 1: Deploy Automático (Recomendado)

1. **Criar conta no Render**: https://render.com
2. **Conectar repositório GitHub**:
   - Faça upload do código para GitHub
   - No Render Dashboard, clique em "New +"
   - Selecione "Blueprint"
   - Conecte seu repositório
   - O Render detectará automaticamente o `render.yaml`

3. **Configurar MongoDB**:
   - Adicione a variável `MONGO_URL` com sua connection string do MongoDB Atlas
   - No Dashboard → Service → Environment → Add Environment Variable

4. **Deploy será automático** após configurar as variáveis

### Opção 2: Deploy Manual

#### Backend:
1. New + → Web Service
2. Build Command: `cd backend && pip install -r requirements.txt`
3. Start Command: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   ```
   MONGO_URL=mongodb+srv://...
   DB_NAME=watizat_db
   JWT_SECRET=your_secret_here
   EMERGENT_LLM_KEY=sk-emergent-b8cEdA5822d14C0638
   CORS_ORIGINS=*
   ```

#### Frontend:
1. New + → Static Site
2. Build Command: `cd frontend && yarn install && yarn build`
3. Publish Directory: `frontend/build`
4. Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://seu-backend.onrender.com
   ```

---

## 🚂 Deploy no Railway

### Passo 1: Preparar o Projeto

1. **Criar conta no Railway**: https://railway.app
2. **Criar novo projeto**: New Project → Deploy from GitHub repo

### Passo 2: Configurar Variáveis

No Railway Dashboard:
- Vá em Variables
- Adicione:
```
MONGO_URL=mongodb+srv://...
DB_NAME=watizat_db
JWT_SECRET=your_secret_here
EMERGENT_LLM_KEY=sk-emergent-b8cEdA5822d14C0638
CORS_ORIGINS=*
PORT=8001
```

### Passo 3: Deploy

O Railway automaticamente:
- Detecta Python e Node.js
- Instala dependências
- Usa o `Procfile` para iniciar os serviços
- Gera uma URL pública

### Passo 4: Atualizar Frontend

Após deploy, atualize `frontend/.env`:
```
REACT_APP_BACKEND_URL=https://seu-projeto.up.railway.app
```

Faça commit e push - Railway fará redeploy automático.

---

## 🔧 Configuração Local (Desenvolvimento)

### 1. Instalar MongoDB Local (opcional)
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Ou use MongoDB Atlas (recomendado)
```

### 2. Instalar Dependências
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
yarn install
```

### 3. Configurar .env
```bash
# backend/.env
MONGO_URL=mongodb://localhost:27017/watizat_db
DB_NAME=watizat_db
JWT_SECRET=dev_secret_change_in_production
EMERGENT_LLM_KEY=sk-emergent-b8cEdA5822d14C0638
CORS_ORIGINS=*

# frontend/.env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 4. Iniciar Serviços

**Opção A: Supervisor (automático)**
```bash
./start.sh
```

**Opção B: Manual**
```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend
yarn start
```

### 5. Acessar Aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api
- Docs API: http://localhost:8001/docs

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"
- Verifique se `MONGO_URL` está correto
- No MongoDB Atlas, adicione seu IP à whitelist (Network Access)
- Ou adicione `0.0.0.0/0` para permitir qualquer IP

### Erro: "Module not found"
```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend
cd frontend && yarn install
```

### Frontend não conecta ao Backend
- Verifique `REACT_APP_BACKEND_URL` no `frontend/.env`
- No Render/Railway, deve ser a URL pública do backend
- Certifique-se de incluir `/api` nas rotas: `${BACKEND_URL}/api/posts`

### Erro 502 Bad Gateway
- Aguarde alguns minutos (serviços levam tempo para iniciar)
- Verifique logs no Dashboard da plataforma
- Confirme que todas variáveis de ambiente estão configuradas

---

## 📊 Monitoramento

### Render
- Dashboard → Service → Logs
- Métricas disponíveis no dashboard

### Railway
- Dashboard → Deployment → Logs
- Métricas de CPU/RAM disponíveis

---

## 🔐 Segurança

### Produção:
1. **Altere `JWT_SECRET`** para um valor seguro
2. **Configure CORS** adequadamente:
   ```
   CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
   ```
3. **MongoDB**: Use IP whitelist no Atlas
4. **HTTPS**: Render e Railway fornecem automaticamente

---

## 📚 Recursos Úteis

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)

---

## 💬 Suporte

Se encontrar problemas:
1. Verifique os logs na plataforma
2. Confirme todas variáveis de ambiente
3. Teste localmente primeiro
4. Verifique conectividade do MongoDB

**Boa sorte com seu deploy! 🎉**
