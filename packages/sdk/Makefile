.PHONY: build


SHELL := /bin/bash

build:
	yarn run build

test: FORCE
	docker start hh-node || docker run --name hh-node -d -p 8545:8545 ethereumoptimism/hardhat 
	./test/scripts/waitForHardhatNode.sh
	yarn run build
	yarn run test:all

FORCE: ;
