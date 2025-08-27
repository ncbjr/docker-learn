# 🐳 Aula de Docker - Material Completo

Este repositório contém todo o material necessário para a aula prática de introdução ao Docker.

## 📁 Estrutura do Projeto

```
auladocker/
├── docker-cheatsheet-completo.md    # Cheat sheet detalhado
├── docker-cheatsheet-poster.md      # Versão resumida (1 página)
├── docker-compose.yml               # Exemplo completo com múltiplos serviços
├── html/
│   └── index.html                   # Página web de exemplo
├── api/
│   └── index.html                   # API simulada
├── sql/
│   └── init.sql                     # Script de inicialização do banco
└── README.md                        # Este arquivo
```

## 🚀 Como Usar

### 1. Exemplo Básico - Nginx com Volume
```bash
# Na pasta do projeto
docker run -d -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html nginx

# Acesse: http://localhost:8080
```

### 2. Exemplo Completo - Docker Compose
```bash
# Subir toda a aplicação
docker-compose up -d

# Acessar os serviços:
# - Frontend: http://localhost:8080
# - API: http://localhost:8081  
# - phpMyAdmin: http://localhost:8082
```

### 3. Comandos Úteis
```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## 📋 Serviços Incluídos

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **web** | 8080 | Servidor Nginx com página HTML |
| **api** | 8081 | API simulada (Apache) |
| **database** | 3306 | MySQL 8.0 com dados de exemplo |
| **phpmyadmin** | 8082 | Interface web para o banco |

## 🎯 Objetivos da Aula

- ✅ Entender conceitos básicos do Docker
- ✅ Executar containers com `docker run`
- ✅ Trabalhar com volumes e portas
- ✅ Criar redes para comunicação
- ✅ Orquestrar com `docker-compose`

## 📚 Material de Apoio

1. **docker-cheatsheet-completo.md** - Referência completa de comandos
2. **docker-cheatsheet-poster.md** - Resumo para impressão/consulta rápida

## 🔧 Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Editor de código (VSCode recomendado)

## 💡 Dicas para Professores

1. **Parte 1**: Comece com o exemplo básico do Nginx
2. **Parte 2**: Mostre como editar o HTML e ver mudanças instantâneas  
3. **Parte 3**: Use o docker-compose.yml para demonstrar orquestração
4. **Parte 4**: Explore os diferentes serviços e como eles se comunicam

## 🐛 Troubleshooting

### Porta já em uso
```bash
# Verificar o que está usando a porta
netstat -tulpn | grep :8080

# Ou usar outra porta
docker run -d -p 8090:80 nginx
```

### Permissões no volume
```bash
# Linux/Mac - ajustar permissões se necessário
sudo chown -R $USER:$USER ./html
```

### Container não sobe
```bash
# Ver logs detalhados
docker-compose logs <nome-do-servico>

# Exemplo
docker-compose logs database
```

## 🎓 Atividades Sugeridas

### Iniciante
1. Modifique o arquivo `html/index.html` e veja as mudanças
2. Acesse diferentes portas e entenda os mapeamentos
3. Explore os logs dos containers

### Intermediário  
1. Adicione um novo serviço no `docker-compose.yml`
2. Crie uma nova rede e conecte containers
3. Experimente diferentes imagens do Docker Hub

### Avançado
1. Crie um Dockerfile personalizado
2. Configure variáveis de ambiente
3. Implemente health checks

## 🔗 Links Úteis

- [Documentação Oficial do Docker](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Play with Docker](https://labs.play-with-docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

**📝 Criado para a disciplina de Engenharia de Software**  
*Sinta-se livre para adaptar este material às suas necessidades!*
