FROM verdaccio/verdaccio

USER root
RUN apk --no-cache add --virtual builds-deps build-base git python
RUN npm i && npm rebuild bcrypt --build-from-source && npm i okode/verdaccio-bitbucket
USER verdaccio

COPY conf /verdaccio/conf