.PHONY: build


SHELL := /bin/bash

build:
	yarn run build

test: FORCE
	./scripts/install_solana.sh
	yarn run amman:start
	yarn run test:all
	yarn run amman:stop

FORCE: ;
