#!/usr/bin/env bash

# check if the sentry cli is installed
if ! [ -x "$(command -v sentry-cli)" ]; then
  # if it's not installed install it
  curl -sL https://sentry.io/get-cli/ | bash
  # print that it's installed
  echo "Sentry CLI installed successfully."
else
  echo "Sentry CLI already installed."
fi