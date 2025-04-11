FROM verdaccio/verdaccio:latest

USER root

COPY ./verdaccio/conf /verdaccio/conf
COPY ./verdaccio/plugins /verdaccio/plugins

WORKDIR /verdaccio/plugins/verdaccio-bitbucket-auth
RUN npm install
RUN npx tsc

USER verdaccio

WORKDIR /home/ubuntu

EXPOSE 4873

CMD ["verdaccio", "--config", "/verdaccio/conf/config.yaml"]
