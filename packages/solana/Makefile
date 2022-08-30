.PHONY: build


SHELL := /bin/bash

build:
	yarn run build

test: FORCE
	sh -c "$(curl -sSfL https://release.solana.com/v1.10.35/install)"
	solana --version
	yarn run build
	yarn run test:all

FORCE: ;
