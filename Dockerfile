FROM node:boron

MAINTAINER Petr Messner

ENV NODE_ENV production

RUN apt-get update
RUN apt-get install -y --no-install-recommends \
    python3

COPY package.json yarn.lock /app/
WORKDIR /app

RUN yarn install

COPY . /app/

RUN yarn run build

# CMD ["yarn", "run", "prod"]
#CMD ./node_modules/next/dist/bin/next-start \
    #--hostname 0.0.0.0 \
    #--port 8000

CMD ["./docker_wrapper.py"]
