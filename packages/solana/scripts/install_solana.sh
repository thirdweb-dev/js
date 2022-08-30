#!/usr/bin/env bash

set -e

sh -c "$(curl -sSfL https://release.solana.com/v1.10.35/install)"
export PATH="/home/runner/.local/share/solana/install/active_release/bin:$PATH"
solana --version