FROM node:18-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/src/main.js"]