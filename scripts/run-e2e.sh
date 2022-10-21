#!/bin/bash

cd test/e2e/react
for d in */; do
  if [ -f "$d/package.json" ]; then
    cd $d
    echo "Installing dependencies in $d"
    yarn
    echo "Building $d"
    yarn build
    echo "Testing $d"
    yarn e2e
    cd ..
  fi
done