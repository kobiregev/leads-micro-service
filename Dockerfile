FROM node:18.12.1-alpine

ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN cd /tmp && npm install --pure-lockfile

ADD ./ /src

RUN cp -a /tmp/node_modules /src/

WORKDIR /src

RUN npm run-script build

## TODO rm before deployment
EXPOSE 4000

CMD ["node","build/src/app.js"]