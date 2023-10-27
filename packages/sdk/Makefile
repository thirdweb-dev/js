.PHONY: build


SHELL := /bin/bash

test-evm: FORCE
	docker start hh-node || docker run --name hh-node -d -p 8545:8545 ethereumoptimism/hardhat 
	./scripts/waitForHardhatNode.sh
	pnpm run test:all

test-sol: FORCE
	./scripts/run_tests.sh

FORCE: ;
