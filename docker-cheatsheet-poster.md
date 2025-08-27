# 🐳 DOCKER - CHEAT SHEET RÁPIDO

## 🚀 COMANDOS BÁSICOS
```bash
docker --version              # Ver versão
docker ps                     # Containers rodando
docker ps -a                  # Todos containers
docker images                 # Listar imagens
docker pull <imagem>          # Baixar imagem
```

## ▶️ RODAR CONTAINERS
```bash
# Nginx na porta 8080
docker run -d -p 8080:80 nginx

# Opções principais:
-d          # Background
-p A:B      # Porta host:container  
--name xyz  # Nome do container
-it         # Interativo + terminal
--rm        # Remove ao parar
```

## 🛑 GERENCIAR
```bash
docker stop <nome>            # Parar
docker start <nome>           # Iniciar
docker restart <nome>         # Reiniciar
docker rm <nome>              # Remover
docker logs <nome>            # Ver logs
docker exec -it <nome> bash   # Acessar shell
```

## 📂 VOLUMES
```bash
# Bind mount (pasta local → container)
docker run -v $(pwd)/html:/usr/share/nginx/html nginx

# Volume nomeado
docker volume create meu_vol
docker run -v meu_vol:/data nginx
```

## 🌐 REDES
```bash
docker network create minha_rede
docker run --network minha_rede --name api nginx
docker run --network minha_rede --name client alpine
```

## ⚙️ DOCKER COMPOSE

### 📄 docker-compose.yml
```yaml
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
  
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: senha123
```

### 🎮 Comandos Compose
```bash
docker-compose up -d          # Subir tudo
docker-compose logs -f        # Ver logs
docker-compose down           # Derrubar tudo
docker-compose ps             # Status dos serviços
```

## 🧹 LIMPEZA
```bash
docker system prune -a        # Limpeza geral
docker container prune        # Remove containers parados
docker image prune            # Remove imagens não usadas
docker volume prune           # Remove volumes não usados
```

## 💡 CONCEITOS CHAVE

| Termo | Significado |
|-------|-------------|
| **Imagem** | Template/molde para containers |
| **Container** | Instância rodando de uma imagem |
| **Volume** | Armazenamento persistente |
| **Network** | Comunicação entre containers |

## 🚨 COMANDOS DE EMERGÊNCIA
```bash
# Parar tudo
docker stop $(docker ps -q)

# Remover todos containers
docker rm $(docker ps -aq)

# Reset total
docker system prune -a --volumes
```

## 📝 EXEMPLOS RÁPIDOS

### 🌐 Servidor Web Simples
```bash
mkdir html
echo "<h1>Minha página!</h1>" > html/index.html
docker run -d -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html nginx
```

### 🗄️ Banco de Dados
```bash
docker run -d --name meudb \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -p 3306:3306 mysql:8.0
```

### 🔗 Dois Containers Conectados
```bash
docker network create app
docker run -d --name api --network app nginx
docker run -it --rm --network app alpine ping api
```

---

**🎯 DICA DE OURO**: Use `docker-compose` para projetos com múltiplos containers!

**📚 Mais info**: https://docs.docker.com | https://hub.docker.com
