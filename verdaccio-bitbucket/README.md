# Verdaccio Bitbucket
Image to deploy Verdaccio with the custom version (https://github.com/okode/verdaccio-bitbucket) of the verdaccio-bitbucket (https://github.com/idangozlan/verdaccio-bitbucket) plugin that allows to give permissions based on the Bitbucket role.

## Building the image

Copy the project verdaccio-bitbucket (https://github.com/okode/verdaccio-bitbucket) to this location (docker/verdaccio-bitbucket folder, not the root of the docker repository) and run `docker build ...`:

```sh
cp -r ../../verdaccio-bitbucket ./ &&  docker build -t okode/verdaccio-bitbucket .
```

## Deploy image to Lightsail

Check the documentation: https://mapfrealm.atlassian.net/wiki/spaces/DKT/pages/1567557274/Instrucciones+del+setup+de+Verdaccio+en+Lightsail