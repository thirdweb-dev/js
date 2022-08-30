#!/usr/bin/env bash

set -e

sh -c "$(curl -sSfL https://release.solana.com/v1.10.35/install)"
solana --version