FROM node:22-alpine

WORKDIR /app

# Dépendances natives pour bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]