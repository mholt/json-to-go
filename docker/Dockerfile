FROM node:current-alpine

RUN npm install -g http-server

COPY . /app

WORKDIR /app

CMD ["http-server"]