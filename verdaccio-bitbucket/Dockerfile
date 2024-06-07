FROM verdaccio/verdaccio:5.31.0

USER root

COPY conf /verdaccio/conf
RUN npm install --global verdaccio-bitbucket
COPY verdaccio-bitbucket/src /usr/local/lib/node_modules/verdaccio-bitbucket/src

USER verdaccio
