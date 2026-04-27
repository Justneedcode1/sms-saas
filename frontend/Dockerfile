FROM node:18-alpine
WORKDIR /app
COPY frontend/package.json .
RUN npm install
COPY frontend/src ./src
COPY frontend/*.html .
COPY frontend/vite.config.js .
EXPOSE 5173
CMD ["npm", "run", "dev"]
