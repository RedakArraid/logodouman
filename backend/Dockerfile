# Dockerfile pour le backend Node.js/Express
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY prisma ./prisma
RUN npx prisma generate
COPY .env.docker .env
COPY . .
EXPOSE 4002
CMD ["npm", "start"] 