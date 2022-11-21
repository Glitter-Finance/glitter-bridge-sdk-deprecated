FROM  node:18-alpine3.15

RUN apk add bash
RUN apk update && apk add vault
RUN apk add vault libcap