#!/usr/bin/env bash

set -e

sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="/home/runner/.local/share/solana/install/active_release/bin:$PATH"
solana --version
bun run node:solana:start &
attempts=0
while ! curl 127.0.0.1:8899  &> /dev/null
do
	if [ $attempts -gt 30 ]; then
		printf "%s" "timed out waiting for solana node"
		exit -1
	fi
    printf "%c" "."
	sleep 1
	attempts=$((attempts+1))
done
bun run test:solana:all
bun run node:solana:stop