#!/bin/bash


# THIS IS MEANT FOR CI ONLY
# This script is used to build the release packages for the nightly builds.

git checkout -b release-nightly
yarn changeset version --snapshot nightly
yarn changeset publish --tag nightly --no-git-tag