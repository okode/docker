FROM verdaccio/verdaccio

USER root
RUN apk --no-cache add --virtual builds-deps build-base git python
RUN yarn && npm rebuild bcrypt --build-from-source && yarn add okode/verdaccio-bitbucket
USER verdaccio

COPY conf /verdaccio/conf