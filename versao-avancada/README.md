# 🔴 Docker - Versão Avançada

## 🎯 **Para que serve esta versão?**

Esta é a versão **avançada** do material, demonstrando um ambiente de produção real com API REST, banco de dados, cache, monitoramento e múltiplos serviços interconectados.

## 🚀 **Como usar**

```bash
# 1. Entre na pasta da versão avançada
cd versao-avancada

# 2. Suba todos os containers (pode demorar alguns minutos na primeira vez)
docker-compose up -d

# 3. Aguarde a inicialização completa
docker-compose logs -f database  # Aguarde "ready for connections"

# 4. Teste a API
curl http://localhost:3001/api/health

# 5. Acesse as interfaces:
# API: http://localhost:3001
# Adminer (DB): http://localhost:8080
# Elasticsearch: http://localhost:9200
```

## 🏗️ **Arquitetura do Sistema**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Nginx     │    │  Frontend   │    │     API     │
│   (Proxy)   │◄──►│   React     │◄──►│   Node.js   │
│   :80/443   │    │    :3000    │    │    :3001    │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                   ┌─────────────┐    ┌─────────────┐
                   │    Redis    │◄──►│    MySQL    │
                   │   (Cache)   │    │ (Database)  │
                   │    :6379    │    │    :3306    │
                   └─────────────┘    └─────────────┘
                           │
                   ┌─────────────┐    ┌─────────────┐
                   │   Adminer   │    │Elasticsearch│
                   │  (DB Admin) │    │   (Logs)    │
                   │    :8080    │    │    :9200    │
                   └─────────────┘    └─────────────┘
```

## 📦 **Containers e Serviços**

| Container | Tecnologia | Porta | Função |
|-----------|------------|-------|---------|
| **api** | Node.js + Express | 3001 | API REST com autenticação |
| **database** | MySQL 8.0 | 3306 | Banco de dados principal |
| **redis** | Redis Alpine | 6379 | Cache e sessões |
| **nginx** | Nginx Alpine | 80/443 | Proxy reverso e SSL |
| **adminer** | Adminer | 8080 | Interface de administração DB |
| **elasticsearch** | Elasticsearch | 9200 | Indexação de logs |
| **frontend** | React.js | 3000 | Interface web (opcional) |

## 🔗 **API Endpoints**

### **Health & Status:**
```bash
GET /api/health              # Health check completo
GET /api/health/simple       # Health check simples
GET /api/health/metrics      # Métricas detalhadas
```

### **Usuários:**
```bash
GET /api/users               # Listar usuários (paginado)
GET /api/users/:id           # Buscar usuário específico
POST /api/users              # Criar novo usuário
PUT /api/users/:id           # Atualizar usuário
DELETE /api/users/:id        # Deletar usuário
```

### **Cursos:**
```bash
GET /api/courses             # Listar todos os cursos
GET /api/courses/:id         # Buscar curso específico
GET /api/courses/stats       # Estatísticas dos cursos
```

### **Autenticação:**
```bash
POST /api/auth/login         # Login (retorna JWT)
POST /api/auth/register      # Registrar novo usuário
POST /api/auth/logout        # Logout
GET /api/auth/verify         # Verificar token JWT
```

## 🧪 **Exemplos de Uso da API**

### **1. Health Check:**
```bash
curl http://localhost:3001/api/health
```

### **2. Listar usuários:**
```bash
curl http://localhost:3001/api/users
curl "http://localhost:3001/api/users?page=1&limit=5"
```

### **3. Criar usuário:**
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "curso": "Engenharia de Software"
  }'
```

### **4. Login e obter token:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "docker@exemplo.com",
    "password": "123456"
  }'
```

### **5. Usar token para acessar recursos protegidos:**
```bash
TOKEN="seu_jwt_token_aqui"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/auth/verify
```

## 🗄️ **Banco de Dados**

### **Acessar via Adminer:**
1. Vá para http://localhost:8080
2. **Sistema:** MySQL
3. **Servidor:** database
4. **Usuário:** api_user
5. **Senha:** api123
6. **Base:** escola_db

### **Acessar via linha de comando:**
```bash
docker exec -it avancado-mysql mysql -u api_user -p escola_db
# Senha: api123
```

### **Estrutura das tabelas:**
- `users` - Usuários/estudantes
- `courses` - Cursos disponíveis
- `enrollments` - Matrículas (relacionamento)
- `access_logs` - Logs de acesso
- `system_config` - Configurações do sistema

## 🔄 **Cache Redis**

### **Acessar Redis CLI:**
```bash
docker exec -it avancado-redis redis-cli
```

### **Comandos úteis:**
```bash
# Ver todas as chaves
KEYS *

# Ver uma chave específica
GET users:page:1:limit:10

# Ver informações do Redis
INFO

# Limpar cache
FLUSHDB
```

## 📊 **Monitoramento e Logs**

### **Ver logs dos containers:**
```bash
# Todos os logs
docker-compose logs -f

# Log específico
docker-compose logs -f api
docker-compose logs -f database
```

### **Métricas da API:**
```bash
curl http://localhost:3001/api/health/metrics
```

### **Elasticsearch (logs):**
```bash
# Status do Elasticsearch
curl http://localhost:9200/_cluster/health

# Índices disponíveis
curl http://localhost:9200/_cat/indices
```

## 🔧 **Desenvolvimento e Debug**

### **Modificar código da API:**
1. Edite arquivos em `api/src/`
2. O container reiniciará automaticamente (nodemon)
3. Veja os logs: `docker-compose logs -f api`

### **Executar comandos dentro dos containers:**
```bash
# API (Node.js)
docker exec -it avancado-api sh

# Banco de dados
docker exec -it avancado-mysql bash

# Redis
docker exec -it avancado-redis sh
```

### **Resetar banco de dados:**
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Recria tudo
```

## 🛡️ **Recursos de Segurança Implementados**

- ✅ **Rate Limiting** - Máximo 100 requests por IP/15min
- ✅ **CORS** - Configurado para frontend
- ✅ **Helmet** - Headers de segurança
- ✅ **JWT** - Autenticação stateless
- ✅ **bcrypt** - Hash de senhas
- ✅ **Validation** - Joi para validação de entrada
- ✅ **SQL Injection Protection** - Prepared statements
- ✅ **Environment Variables** - Configuração segura

## 🎓 **Para o Professor**

### **Tempo sugerido:** 90-120 minutos

### **Roteiro de aula:**
1. **Arquitetura (15 min):** Explicar a stack completa
2. **Subir ambiente (10 min):** docker-compose up + aguardar
3. **Explorar API (30 min):** Testar endpoints, mostrar cache
4. **Banco de dados (20 min):** Adminer, relacionamentos, SQL
5. **Monitoramento (15 min):** Logs, health checks, métricas
6. **Discussão (15 min):** Produção, escalabilidade, DevOps

### **Conceitos avançados abordados:**
- **Microserviços** - Separação de responsabilidades
- **API Design** - REST, paginação, filtros
- **Caching** - Redis para performance
- **Autenticação** - JWT, bcrypt, middleware
- **Observabilidade** - Health checks, logs, métricas
- **Persistência** - Volumes, backup, migrations
- **Networking** - Comunicação inter-container
- **Security** - Rate limiting, CORS, validation

## 🚀 **Próximos Passos**

Após dominar esta versão, explore:
- **Docker Swarm** - Orquestração nativa
- **Kubernetes** - Orquestração enterprise
- **CI/CD** - GitHub Actions + Docker
- **Monitoring** - Prometheus + Grafana
- **Load Balancing** - Múltiplas instâncias
- **Secrets Management** - Docker secrets
- **Multi-stage builds** - Otimização de imagens

---

**💡 Dica:** Esta versão demonstra padrões de produção reais e é ideal para estudantes que já conhecem os conceitos básicos!
