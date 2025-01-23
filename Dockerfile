FROM node:lts-alpine AS build

WORKDIR /root

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /home/node

COPY --from=build --chown=node:node /root/node_modules ./node_modules
COPY --from=build --chown=node:node /root/views ./views
COPY --from=build --chown=node:node /root/dist .

USER node

EXPOSE 2875

CMD ["node", "app.js"]
