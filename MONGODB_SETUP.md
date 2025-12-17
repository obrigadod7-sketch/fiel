# 🗄️ Configuração MongoDB Atlas - Watizat

Este guia mostra como configurar o MongoDB Atlas (banco de dados gratuito na nuvem) para a aplicação Watizat.

## ⚡ Opção Rápida

Se você já tem experiência com MongoDB Atlas, aqui está o que precisa:

1. **Criar cluster gratuito** no MongoDB Atlas
2. **Obter Connection String**: `mongodb+srv://username:password@cluster.mongodb.net/watizat_db`
3. **Adicionar IP à whitelist**: `0.0.0.0/0` (permite qualquer IP)
4. **Configurar variável**: `MONGO_URL=sua_connection_string`

---

## 📚 Guia Passo a Passo

### Passo 1: Criar Conta

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Clique em **"Try Free"**
3. Crie sua conta (pode usar Google/GitHub)

### Passo 2: Criar Cluster Gratuito

1. Após login, clique em **"Build a Database"**
2. Escolha **"Shared"** (plano gratuito - M0)
3. Selecione:
   - **Cloud Provider**: AWS (ou qualquer outro)
   - **Region**: Escolha a mais próxima (ex: Frankfurt para Europa)
   - **Cluster Tier**: M0 Sandbox (FREE)
4. **Cluster Name**: Deixe padrão ou nomeie como "Watizat"
5. Clique em **"Create Cluster"**

⏱️ *Aguarde 1-3 minutos para o cluster ser criado*

### Passo 3: Criar Usuário do Banco

1. Na tela de segurança que aparece:
   - **Username**: `watizat_user` (ou outro nome)
   - **Password**: Gere uma senha forte (ANOTE ela!)
   - Clique em **"Create User"**

💡 **Importante**: Salve essas credenciais em local seguro!

### Passo 4: Configurar Acesso de Rede

1. Na mesma tela ou em **"Network Access"**:
2. Clique em **"Add IP Address"**
3. Escolha uma opção:
   - **Desenvolvimento/Teste**: `0.0.0.0/0` (permite qualquer IP)
   - **Produção**: Adicione IPs específicos do Render/Railway
4. Clique em **"Confirm"**

⚠️ **Nota de Segurança**: 
- `0.0.0.0/0` é OK para desenvolvimento
- Para produção, use IPs específicos ou VPN

### Passo 5: Obter Connection String

1. Volte para **"Database"** (menu lateral)
2. Clique em **"Connect"** no seu cluster
3. Escolha **"Connect your application"**
4. **Driver**: Python → Version: 3.6 or later
5. Copie a **Connection String**:

```
mongodb+srv://watizat_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **IMPORTANTE**: Substitua `<password>` pela senha real do usuário!

Exemplo final:
```
mongodb+srv://watizat_user:MinhaSenh@123@cluster0.abcde.mongodb.net/watizat_db?retryWrites=true&w=majority
```

### Passo 6: Configurar na Aplicação

#### Para Desenvolvimento Local:

Edite `/app/backend/.env`:
```env
MONGO_URL=mongodb+srv://watizat_user:SuaSenha@cluster.xxxxx.mongodb.net/watizat_db?retryWrites=true&w=majority
```

#### Para Render:

1. Dashboard → Service → Environment
2. Adicione variável:
   - **Key**: `MONGO_URL`
   - **Value**: Sua connection string completa

#### Para Railway:

1. Dashboard → Variables
2. Adicione:
   - **Variable**: `MONGO_URL`
   - **Value**: Sua connection string completa

---

## 🧪 Testar Conexão

### Localmente:

```bash
cd /app/backend
python3 -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def test():
    client = AsyncIOMotorClient('SUA_CONNECTION_STRING')
    await client.admin.command('ping')
    print('✅ Conexão com MongoDB bem-sucedida!')

asyncio.run(test())
"
```

### Via API:

Inicie o backend e teste:
```bash
curl http://localhost:8001/api/
```

Se retornar `{"message":"Watizat API - Bem-vindo!"}` → ✅ Funcionando!

---

## 🔍 Verificar Dados no Atlas

1. Dashboard → **"Browse Collections"**
2. Verá o database `watizat_db`
3. Collections:
   - `users`
   - `posts`
   - `messages`
   - `advertisements`
   - `help_locations`

---

## ⚙️ Collections Necessárias

A aplicação cria automaticamente as collections quando necessário:

| Collection | Descrição |
|------------|-----------|
| `users` | Usuários (migrantes, voluntários, admins) |
| `posts` | Posts de ajuda (necessidades e ofertas) |
| `messages` | Mensagens diretas entre usuários |
| `comments` | Comentários em posts |
| `matches` | Conexões entre ajudantes e migrantes |
| `ai_chats` | Histórico de conversas com IA |
| `services` | Serviços de ajuda |
| `advertisements` | Anúncios motivacionais e doações |
| `help_locations` | Locais de ajuda em Paris |
| `job_cache` | Cache de vagas de emprego |

---

## 🐛 Troubleshooting

### Erro: "Authentication failed"
- ✅ Verifique se substituiu `<password>` pela senha real
- ✅ Senha não pode conter caracteres especiais sem encoding
- 💡 Use URL encoding se senha tiver `@`, `#`, etc.

### Erro: "Connection timeout"
- ✅ Verifique IP whitelist em Network Access
- ✅ Adicione `0.0.0.0/0` temporariamente para testar
- ✅ Verifique se cluster está ativo (não pausado)

### Erro: "No database/collections found"
- ✅ É normal! Collections são criadas automaticamente ao inserir dados
- ✅ Registre um usuário via API para criar a collection `users`

### Cluster pausado (inativo por 60 dias)
- ✅ Clusters M0 pausam após 60 dias sem uso
- ✅ Clique em "Resume" no dashboard para reativar

---

## 📊 Monitoramento

### Ver Logs de Conexão:
- Dashboard → Metrics → Connection Count
- Dashboard → Logs → Server Logs

### Limites do Plano Gratuito (M0):
- ✅ **512 MB de armazenamento**
- ✅ **Shared RAM e CPU**
- ✅ **Conexões**: Até 500 simultâneas
- ✅ **Backup**: Não incluído (apenas em planos pagos)

💡 **Suficiente para**: Desenvolvimento, testes e MVPs pequenos

---

## 🔄 Migração de Dados

### Importar dados existentes:

```bash
# Exportar de MongoDB local
mongodump --db watizat_db --out ./backup

# Importar para Atlas
mongorestore --uri "mongodb+srv://..." --db watizat_db ./backup/watizat_db
```

### Backup manual:

```bash
mongodump --uri "mongodb+srv://..." --db watizat_db --out ./backup_$(date +%Y%m%d)
```

---

## 💰 Upgrade (Opcional)

Se precisar de mais recursos:
- **M2**: $9/mês - 2GB storage
- **M5**: $25/mês - 5GB storage + backups
- **M10+**: Clusters dedicados com alta performance

---

## 📚 Recursos Úteis

- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Connection String Docs](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Network Access](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
- [Motor (Async Driver)](https://motor.readthedocs.io/)

---

## ✅ Checklist Final

- [ ] Conta criada no MongoDB Atlas
- [ ] Cluster M0 gratuito criado
- [ ] Usuário do banco criado
- [ ] IP `0.0.0.0/0` adicionado à whitelist
- [ ] Connection string obtida e senha substituída
- [ ] `MONGO_URL` configurada no `.env`
- [ ] Conexão testada com sucesso
- [ ] Backend iniciado sem erros

**Tudo certo? Sua aplicação está pronta para usar MongoDB Atlas! 🎉**
