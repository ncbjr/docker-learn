# 🟢 Docker - Versão Simples

## 🎯 **Para que serve esta versão?**

Esta é a versão **iniciante** do material de Docker, focada em ensinar os conceitos fundamentais de forma clara e sem complexidade desnecessária.

## 🚀 **Como usar**

```bash
# 1. Entre na pasta da versão simples
cd versao-simples

# 2. Suba os containers
docker-compose up -d

# 3. Acesse no navegador:
# Frontend: http://localhost:8080
# API: http://localhost:8081

# 4. Para parar tudo:
docker-compose down
```

## 📦 **O que você vai aprender**

### **Containers incluídos:**
- **web**: Nginx servindo uma página HTML
- **api**: Apache servindo uma "API" simulada

### **Conceitos demonstrados:**
1. ✅ **Containers básicos** - Como rodar serviços isolados
2. ✅ **Mapeamento de portas** - Como acessar containers do host
3. ✅ **Volumes** - Como persistir e editar arquivos
4. ✅ **Docker Compose** - Como orquestrar múltiplos containers
5. ✅ **Comunicação** - Como containers "conversam" entre si

## 🧪 **Exercícios Práticos**

### **Exercício 1: Modificar a página**
1. Abra o arquivo `html/index.html`
2. Mude o título ou adicione seu nome
3. Salve e recarregue http://localhost:8080
4. **Resultado:** Veja a mudança instantânea!

### **Exercício 2: Explorar comandos**
```bash
# Ver containers rodando
docker ps

# Ver logs do nginx
docker logs simples-nginx

# Entrar no container (opcional)
docker exec -it simples-nginx sh
```

### **Exercício 3: Testar comunicação**
```bash
# Dentro do container nginx, fazer ping para a API
docker exec simples-nginx ping api

# Resultado: Vai funcionar! Os containers se "enxergam"
```

## 📋 **Comandos Essenciais**

```bash
# Subir containers
docker-compose up -d

# Ver status
docker-compose ps

# Ver logs
docker-compose logs
docker-compose logs web  # logs específicos

# Parar containers
docker-compose stop

# Parar e remover
docker-compose down

# Reconstruir (se mudar docker-compose.yml)
docker-compose up -d --force-recreate
```

## 🎓 **Para o Professor**

### **Tempo sugerido:** 30-45 minutos

### **Roteiro de aula:**
1. **Explicar conceitos (10 min):** Container vs VM, imagens, etc.
2. **Demonstrar comandos (15 min):** docker run, docker-compose
3. **Exercícios práticos (15 min):** Alunos modificam arquivos
4. **Discussão (5 min):** Dúvidas e próximos passos

### **Pontos importantes:**
- Enfatize que os containers são **isolados** mas podem se **comunicar**
- Mostre como volumes permitem **edição em tempo real**
- Explique que docker-compose **facilita** gerenciar múltiplos containers
- Use esta versão como **base** antes de partir para conceitos avançados

## 🔄 **Próximos Passos**

Depois de dominar esta versão, os alunos estarão prontos para:
- **Versão Avançada** - API real com banco de dados
- **Dockerfile personalizado** - Criar suas próprias imagens
- **Redes customizadas** - Isolamento avançado
- **Volumes nomeados** - Persistência profissional

---

**💡 Dica:** Esta versão é perfeita para **primeiras aulas** e **demonstrações rápidas**!
