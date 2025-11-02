# frontend/Dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x node_modules/.bin/*

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
