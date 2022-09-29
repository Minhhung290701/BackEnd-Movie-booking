FROM node:14-alpine as builder


WORKDIR /app
COPY package.json ./

RUN yarn install --production \
    && yarn global add pm2 
COPY . /app

USER node
EXPOSE 3000

CMD ["pm2-docker", "start", "process.config.js", "--no-auto-exit"]
