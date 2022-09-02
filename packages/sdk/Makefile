.PHONY: build


SHELL := /bin/bash

test: FORCE
	docker start hh-node || docker run --name hh-node -d -p 8545:8545 ethereumoptimism/hardhat 
	./test/scripts/waitForHardhatNode.sh
	yarn run test:all

FORCE: ;
