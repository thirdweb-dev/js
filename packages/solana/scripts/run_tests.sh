#!/usr/bin/env bash

set -e

sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="/home/runner/.local/share/solana/install/active_release/bin:$PATH"
solana --version
yarn run amman:start
yarn run test:all
yarn run amman:stop