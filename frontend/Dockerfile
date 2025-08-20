FROM node:20-alpine

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
