FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /home/node

COPY package.json package-lock.json ./

RUN npm install

COPY --chown=node:node ./init.sh ./
COPY --chown=node:node ./knexfile.js ./
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./views ./views

USER node

RUN chmod u+x ./init.sh

EXPOSE 2875

ENTRYPOINT ["./init.sh"]

CMD ["npm", "start"]
