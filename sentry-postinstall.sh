#!/usr/bin/env bash

# check if the install script exists at the vercel path
if [ -f "./vercel/path0/node_modules/@sentry/cli/scripts/install.js" ]; then
  # run the install script
  bun ./vercel/path0/node_modules/@sentry/cli/scripts/install.js
  # log
  echo "Sentry CLI installed on Vercel"
fi

# check if the install scripts at the local path
if [ -f "./node_modules/@sentry/cli/scripts/install.js" ]; then
  # run the install script
  bun ./node_modules/@sentry/cli/scripts/install.js
  # log
  echo "Sentry CLI installed"
fi