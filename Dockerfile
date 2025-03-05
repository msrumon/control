FROM node:lts-alpine AS build

WORKDIR /root

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /home/node

COPY --from=build --chown=node:node /root/package.json /root/package-lock.json ./
COPY --from=build --chown=node:node /root/node_modules ./node_modules

RUN npm prune

COPY --from=build --chown=node:node /root/views ./views
COPY --from=build --chown=node:node /root/dist .
COPY --from=build --chown=node:node /root/init.sh ./

RUN chmod u+x ./init.sh

USER node

EXPOSE 2875

ENTRYPOINT ["./init.sh"]

CMD ["node", "./src/app.js"]
