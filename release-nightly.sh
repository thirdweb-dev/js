#!/bin/bash

git checkout -b release-nightly
yarn changeset version --snapshot nightly
yarn changeset publish --tag nightly --no-git-tag