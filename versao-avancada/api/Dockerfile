# Dockerfile para API Node.js
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache curl

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Criar diretório para uploads
RUN mkdir -p uploads

# Expor porta
EXPOSE 3001

# Comando de desenvolvimento (com hot reload)
CMD ["npm", "run", "dev"]
