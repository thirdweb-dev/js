.PHONY: build


SHELL := /bin/bash

build:
	yarn run build

test: FORCE
	./scripts/install_solana.sh
	yarn run build
	yarn run test:all

FORCE: ;
