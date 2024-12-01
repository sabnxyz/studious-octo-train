FROM node:18.18.0-alpine
WORKDIR '/app'
RUN npm i pnpm -g
COPY ./package.json ./
RUN pnpm install
COPY . .

RUN npm run build
CMD ["npm", "run", "start"]