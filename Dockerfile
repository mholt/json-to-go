FROM python:3.9-alpine

ENV WORK_DIR='/app'
ENV LISTEN_PORT=9000

RUN apk add --no-cache --update git bash

RUN mkdir -p ${WORK_DIR}
RUN git clone -b gh-pages https://github.com/mholt/json-to-go.git ${WORK_DIR}

RUN chown -R 1337:1337 ${WORK_DIR}
USER 1337

WORKDIR ${WORK_DIR}
EXPOSE ${LISTEN_PORT}

ENTRYPOINT python3 -m http.server ${LISTEN_PORT} --directory ${WORK_DIR}

