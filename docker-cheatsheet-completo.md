# 🐳 Docker – Cheat Sheet Completo

## 📦 Comandos Essenciais

```bash
# Verificar versão do Docker
docker --version

# Listar containers em execução
docker ps

# Listar todos os containers (inclusive parados)
docker ps -a

# Listar imagens locais
docker images

# Baixar uma imagem
docker pull <imagem>

# Rodar um container
docker run <opções> <imagem>
```

## ▶️ Rodando Containers

```bash
# Exemplo: subir Nginx na porta 8080
docker run -d -p 8080:80 nginx

# Exemplo com nome personalizado
docker run -d -p 8080:80 --name meu-nginx nginx

# Rodar container interativo (com terminal)
docker run -it ubuntu bash
```

### 🔧 Principais Opções do `docker run`:

| Opção | Descrição |
|-------|-----------|
| `-d` | Detached (rodar em background) |
| `-p A:B` | Mapear porta host:container |
| `--name xyz` | Dar nome ao container |
| `-it` | Interativo com terminal |
| `-v` | Montar volume |
| `--network` | Conectar à rede específica |
| `-e` | Definir variável de ambiente |
| `--rm` | Remover container ao parar |

## 🛑 Gerenciamento de Containers

```bash
# Parar um container
docker stop <id|nome>

# Iniciar novamente
docker start <id|nome>

# Reiniciar
docker restart <id|nome>

# Remover um container (deve estar parado)
docker rm <id|nome>

# Forçar remoção (mesmo se estiver rodando)
docker rm -f <id|nome>

# Remover todos os containers parados
docker container prune

# Remover uma imagem
docker rmi <imagem>
```

## 📂 Volumes (Persistência de Dados)

```bash
# Criar um volume nomeado
docker volume create meu_volume

# Listar volumes
docker volume ls

# Usar volume nomeado
docker run -d -v meu_volume:/data nginx

# Usar bind mount (diretório local → container)
docker run -d -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html nginx

# No Windows (PowerShell)
docker run -d -p 8080:80 -v ${PWD}/html:/usr/share/nginx/html nginx

# Remover volumes não utilizados
docker volume prune
```

### 📁 Tipos de Volumes:

- **Named Volume**: `docker run -v meu_volume:/data`
- **Bind Mount**: `docker run -v /caminho/local:/caminho/container`
- **Anonymous Volume**: `docker run -v /data`

## 🌐 Redes

```bash
# Listar redes
docker network ls

# Criar rede customizada
docker network create minha_rede

# Rodar container conectado à rede
docker run -d --name api --network minha_rede nginx

# Conectar container existente à rede
docker network connect minha_rede <container>

# Desconectar da rede
docker network disconnect minha_rede <container>

# Remover rede
docker network rm minha_rede
```

### 🔗 Tipos de Rede:

- **bridge**: Rede padrão isolada
- **host**: Usa rede do host diretamente
- **none**: Sem conectividade de rede

## ⚙️ Docker Compose

### 📄 Arquivo `docker-compose.yml` básico:

```yaml
version: '3.8'
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - app-network
    
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: exemplo123
      MYSQL_DATABASE: meuapp
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
    driver: bridge
```

### 🚀 Comandos do Docker Compose:

```bash
# Subir todos os serviços (em background)
docker-compose up -d

# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f web

# Parar todos os serviços
docker-compose stop

# Derrubar tudo (containers, redes)
docker-compose down

# Derrubar tudo + volumes
docker-compose down -v

# Reconstruir imagens antes de subir
docker-compose up --build

# Escalar um serviço (rodar múltiplas instâncias)
docker-compose up -d --scale web=3
```

## 🔍 Diagnóstico e Debugging

```bash
# Ver logs do container
docker logs <id|nome>

# Seguir logs em tempo real
docker logs -f <id|nome>

# Acessar shell dentro do container
docker exec -it <id|nome> bash

# Executar comando específico no container
docker exec <id|nome> ls -la

# Inspecionar detalhes completos (JSON)
docker inspect <id|nome>

# Ver estatísticas de uso (CPU, RAM)
docker stats

# Ver processos rodando no container
docker top <id|nome>
```

## 🧹 Limpeza e Manutenção

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Remover volumes não utilizados
docker volume prune

# Remover redes não utilizadas
docker network prune

# Limpeza geral (containers, redes, imagens, cache)
docker system prune -a

# Ver espaço ocupado pelo Docker
docker system df
```

## 🏷️ Trabalhando com Imagens

```bash
# Construir imagem a partir de Dockerfile
docker build -t minha-imagem .

# Construir com tag específica
docker build -t minha-imagem:v1.0 .

# Listar imagens
docker images

# Remover imagem
docker rmi <imagem>

# Fazer push para registry
docker push minha-imagem:v1.0

# Fazer pull de registry
docker pull minha-imagem:v1.0

# Salvar imagem em arquivo
docker save -o minha-imagem.tar minha-imagem

# Carregar imagem de arquivo
docker load -i minha-imagem.tar
```

## 📌 Dicas Importantes

### 💡 Conceitos Fundamentais:
- **Imagem**: Template/molde para criar containers
- **Container**: Instância em execução de uma imagem
- **Volume**: Armazenamento persistente de dados
- **Network**: Comunicação entre containers

### ⚡ Boas Práticas:
- Use sempre tags específicas: `nginx:1.21` em vez de `nginx:latest`
- Remova containers e imagens não utilizados regularmente
- Use `.dockerignore` para excluir arquivos desnecessários
- Prefira `docker-compose` para aplicações multi-container
- Mantenha containers stateless (sem estado)

### 🚨 Comandos de Emergência:
```bash
# Parar todos os containers
docker stop $(docker ps -q)

# Remover todos os containers
docker rm $(docker ps -aq)

# Limpeza total do sistema
docker system prune -a --volumes
```

## 🔗 Recursos Úteis

- **Documentação Oficial**: https://docs.docker.com/
- **Docker Hub**: https://hub.docker.com/
- **Play with Docker**: https://labs.play-with-docker.com/
- **Dockerfile Reference**: https://docs.docker.com/engine/reference/builder/

---

**📚 Criado para a disciplina de Engenharia de Software**  
*Mantenha este cheat sheet sempre à mão durante suas práticas com Docker!*
