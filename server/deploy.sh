#!/bin/bash

echo What should the version be?
read VERSION

docker build -t deviiie/lireddit:$VERSION .
docker push deviiie/lireddit:$VERSION
ssh root@159.223.48.82 "docker pull deviiie/lireddit:$VERSION && docker tag deviiie/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"