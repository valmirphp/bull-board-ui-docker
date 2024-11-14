FROM node:20-alpine3.20

LABEL maintainer="Valmir Barbosa"

# ------------------------------------------
# change the working directory
# ------------------------------------------
WORKDIR /home/node/app

# ----------------  --------------------------
# install dependences
# ------------------------------------------
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

RUN yarn install --immutable

## ------------------------------------------
## install and use yarn 4.x
## ------------------------------------------
#ENV COREPACK_HOME=/tmp/corepack
#RUN mkdir -p /tmp/corepack/v1 && chmod -R 777 /tmp/corepack
#RUN corepack enable
##RUN corepack enable yarn && corepack use yarn@4.4.1

# ------------------------------------------
# copy content from builder
# ------------------------------------------
COPY . .

EXPOSE 3000

# ------------------------------------------
# start server
# ------------------------------------------
USER node

CMD [ "node", "src/index.js" ]
