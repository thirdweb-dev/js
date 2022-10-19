#!/bin/bash

# prune evertything in e2e
rm -rf e2e

# create e2e folder
mkdir e2e

# make sure everything is built
yarn build

# install cli locally
cd packages/cli
ls
npm install -g ./ --force
cd ../..

# let's yalc push everything
yarn push

# create CRA project
thirdweb create ./e2e/cra --app --cra --js
# cd into cra project
cd e2e/cra
# install dependencies
yalc add @thirdweb-dev/sdk @thirdweb-dev/react
# yarn again
yarn
# run build
yarn build

# reset
cd ../..

# create vite project
thirdweb create ./e2e/vite --app --vite --js
# cd into vite project
cd e2e/vite
# install dependencies
yalc add @thirdweb-dev/sdk @thirdweb-dev/react
# yarn again
yarn
# run build
yarn build