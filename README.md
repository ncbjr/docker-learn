# 🐳 Aula de Docker - Material Completo

Este repositório contém material didático para ensino de Docker em duas versões progressivas, permitindo uma abordagem pedagógica dinâmica e adaptável ao nível da turma.

## 📚 **Estrutura do Repositório**

```
auladocker/
├── versao-simples/          # 🟢 Para iniciantes
│   ├── docker-compose.yml   # Apenas 2 containers básicos
│   ├── html/                # Página web estática
│   └── api/                 # API simulada (HTML)
│
├── versao-avancada/         # 🔴 Para estudantes avançados
│   ├── docker-compose.yml   # 7 containers interconectados
│   ├── api/                 # API REST real (Node.js + Express)
│   ├── frontend/            # Frontend React (opcional)
│   ├── database/            # Scripts SQL + dados
│   └── nginx/               # Proxy reverso
│
├── docker-cheatsheet-*.md   # Cheat sheets para consulta
└── README.md               # Este arquivo
```

---

## 🟢 **VERSÃO SIMPLES - Para Iniciantes**

### 🎯 **Objetivo:**
Ensinar os conceitos fundamentais do Docker de forma clara e sem complexidade desnecessária.

### 📦 **O que inclui:**
- **2 containers apenas:** Nginx + Apache
- **Conceitos básicos:** Portas, volumes, comunicação
- **Comandos essenciais:** `docker run`, `docker-compose`
- **Interface visual:** Páginas HTML explicativas

### 🚀 **Como usar:**
```bash
cd versao-simples
docker-compose up -d

# Acessar:
# Frontend: http://localhost:8080
# API: http://localhost:8081
```

### 📋 **Conceitos ensinados:**
- ✅ Containers vs imagens
- ✅ Mapeamento de portas (`-p`)
- ✅ Volumes para persistência (`-v`)
- ✅ Comunicação entre containers
- ✅ Docker Compose básico
- ✅ Comandos essenciais

### 👥 **Ideal para:**
- Estudantes iniciantes
- Primeiras aulas de Docker
- Demonstrações rápidas (15-30 min)
- Quando o foco é conceitual

---

## 🔴 **VERSÃO AVANÇADA - Para Estudantes Experientes**

### 🎯 **Objetivo:**
Demonstrar um ambiente de produção real com múltiplos serviços interconectados, cache, banco de dados e monitoramento.

### 📦 **O que inclui:**
- **7 containers orquestrados:**
  - 🌐 **Frontend:** React.js (porta 3000)
  - 🚀 **API:** Node.js + Express (porta 3001)
  - 🗄️ **Database:** MySQL 8.0 (porta 3306)
  - 🔄 **Cache:** Redis (porta 6379)
  - ⚖️ **Proxy:** Nginx (porta 80/443)
  - 🔧 **Admin:** Adminer (porta 8080)
  - 📊 **Logs:** Elasticsearch (porta 9200)

### 🚀 **Como usar:**
```bash
cd versao-avancada
docker-compose up -d

# Aguardar inicialização (~2-3 minutos)
# Acessar:
# API: http://localhost:3001
# Adminer: http://localhost:8080
# Elasticsearch: http://localhost:9200
```

### 🔗 **Endpoints da API Real:**
```
GET  /api/health              # Health check completo
GET  /api/users               # Listar usuários (com paginação)
GET  /api/users/:id           # Buscar usuário específico
POST /api/users               # Criar usuário
PUT  /api/users/:id           # Atualizar usuário
GET  /api/courses             # Listar cursos
GET  /api/courses/stats       # Estatísticas dos cursos
POST /api/auth/login          # Login (retorna JWT)
POST /api/auth/register       # Registrar usuário
```

### 📋 **Conceitos avançados:**
- ✅ **Microserviços:** Separação de responsabilidades
- ✅ **API REST:** CRUD completo com validação
- ✅ **Banco de dados:** MySQL com relacionamentos
- ✅ **Cache:** Redis para performance
- ✅ **Autenticação:** JWT + bcrypt
- ✅ **Proxy reverso:** Nginx como gateway
- ✅ **Monitoramento:** Health checks e logs
- ✅ **Persistência:** Volumes nomeados
- ✅ **Redes:** Isolamento e comunicação
- ✅ **Environment:** Variáveis de ambiente
- ✅ **Security:** Rate limiting, CORS, Helmet

### 🧪 **Testando a API:**
```bash
# Health check
curl http://localhost:3001/api/health

# Listar usuários
curl http://localhost:3001/api/users

# Criar usuário
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","curso":"Docker"}'

# Login (retorna token JWT)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"docker@exemplo.com","password":"123456"}'
```

### 👥 **Ideal para:**
- Estudantes com conhecimento básico
- Demonstração de arquiteturas reais
- Aulas longas (1-2 horas)
- Quando o foco é prático/profissional

---

## 🎓 **Estratégia Pedagógica Sugerida**

### **Aula Básica (45 min):**
1. **Conceitos (10 min):** O que é Docker, problema que resolve
2. **Versão Simples (25 min):** Hands-on com containers básicos
3. **Exercícios (10 min):** Modificar HTML, testar comandos

### **Aula Avançada (90 min):**
1. **Revisão (10 min):** Conceitos da aula básica
2. **Versão Avançada (60 min):** API real, banco, cache
3. **Exploração (20 min):** Logs, monitoramento, troubleshooting

### **Workshop Completo (3 horas):**
1. **Módulo 1:** Versão simples + conceitos
2. **Módulo 2:** Versão avançada + arquitetura
3. **Módulo 3:** Deployment, segurança, boas práticas

---

## 🛠️ **Pré-requisitos**

### **Para Versão Simples:**
- Docker instalado
- Docker Compose
- Navegador web

### **Para Versão Avançada:**
- Docker instalado (versão recente)
- Docker Compose v2
- 4GB+ RAM disponível
- curl ou Postman (para testar API)

---

## 📚 **Material de Apoio**

1. **[docker-cheatsheet-completo.md](docker-cheatsheet-completo.md)** - Referência completa
2. **[docker-cheatsheet-poster.md](docker-cheatsheet-poster.md)** - Resumo para impressão

---

## 🐛 **Troubleshooting**

### **Problemas Comuns:**

**Porta já em uso:**
```bash
# Ver o que está usando a porta
netstat -tulpn | grep :3000
# Ou mudar a porta no docker-compose.yml
```

**Container não inicia:**
```bash
# Ver logs detalhados
docker-compose logs [nome-do-servico]
# Exemplo: docker-compose logs api
```

**Banco não conecta:**
```bash
# Aguardar inicialização completa
docker-compose logs database
# Verificar se terminou com "ready for connections"
```

**API retorna erro 500:**
```bash
# Verificar logs da API
docker-compose logs api
# Verificar se banco está funcionando
curl http://localhost:3001/api/health
```

---

## 🎯 **Objetivos de Aprendizagem**

### **Após a Versão Simples, o aluno saberá:**
- [ ] O que são containers e imagens
- [ ] Como executar containers básicos
- [ ] Mapear portas e volumes
- [ ] Usar Docker Compose
- [ ] Comandos essenciais do Docker

### **Após a Versão Avançada, o aluno saberá:**
- [ ] Arquitetar aplicações multi-container
- [ ] Configurar redes e volumes
- [ ] Implementar cache e persistência
- [ ] Monitorar containers em produção
- [ ] Aplicar boas práticas de segurança
- [ ] Fazer troubleshooting de problemas

---

## 🤝 **Contribuindo**

Sinta-se livre para:
- Reportar bugs ou problemas
- Sugerir melhorias pedagógicas
- Adicionar novos exemplos
- Melhorar a documentação

---

## 📄 **Licença**

Material educacional de uso livre para fins acadêmicos.

---

**📝 Criado para disciplinas de Engenharia de Software, DevOps e Containers**  
*Adapte este material às necessidades da sua turma!* 🚀