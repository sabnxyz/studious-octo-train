FROM node:18-alpine
RUN echo "inside frontend"
RUN npm i pnpm -g
WORKDIR '/app'
COPY ./package.json ./
RUN pnpm install
COPY . .
RUN npm run build
CMD ["npm","run","start"]

