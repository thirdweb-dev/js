#!/usr/bin/env bash

set -e

echo "Setting up environment..."

# check if pnpm is installed
if ! command -v pnpm &> /dev/null
then
    echo "⌛️ \"pnpm\" seems to not be installed, installing it now..."
    # if not, install it using corepack if that is available
    if command -v corepack &> /dev/null
    then
        corepack enable
        corepack prepare pnpm@8.1.0 --activate
    else
        # if not, install it using npm
        npm install -g pnpm
    fi
else 
    # if it is, just confirm that to the user
    echo "✅ \"pnpm\" is already installed"
fi

# check if there is still a leftover yarn.lock file
if [ -f "yarn.lock" ]
then
    echo "⌛️ \"yarn.lock\" file found, removing it..."
    rm yarn.lock
    echo "✅ \"yarn.lock\" file removed"
    # if we had a yarn lock we likely also have to remove all node_modules folders
    echo "⌛️ Removing all \"node_modules\" folders in project..."
    find ./ -name "node_modules" -type d -exec rm -rf {} \;
    echo "✅ Removed all \"node_modules\" folders in project"
fi

# after all of that we'll want to re-install dependencies using pnpm
echo "⌛️ Installing dependencies using \"pnpm\"..."
pnpm install
echo "✅ Installed dependencies using \"pnpm\""

# we're finished
echo "✅ Environment setup complete"