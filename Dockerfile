FROM node:lts-alpine AS build

WORKDIR /root

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM build

ENV NODE_ENV=production

WORKDIR /home/node

COPY --from=build /root/node_modules ./node_modules
COPY --from=build /root/dist .

USER node

EXPOSE 2875

CMD ["node", "app.js"]
