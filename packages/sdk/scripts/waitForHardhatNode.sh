#!/bin/bash

printf "%s" "waiting for hardhat node "
attempts=0
while ! curl 127.0.0.1:8545  &> /dev/null
do
	if [ $attempts -gt 30 ]; then
		printf "%s" "timed out waiting for hardhat node"
		exit -1
	fi
    printf "%c" "."
	sleep 1
	attempts=$((attempts+1))
done
printf "\n%s\n"  "Hardhat node is up and running"