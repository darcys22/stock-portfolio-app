FROM node:0.12

WORKDIR /home

RUN apt-get update \
 && apt-get install git

RUN npm install -g gulp bower pm2

RUN groupadd -r node \
 &&  useradd -r -m -g node node

RUN git clone https://github.com/darcys22/stock-portfolio-app.git app
COPY . app/config/

RUN chown -R node:node app
USER node

RUN cd app \
 && npm install \
 && bower install \
 && gulp

ENV PORT 3000
EXPOSE 3000

WORKDIR app

CMD [ "npm", "start" ]

