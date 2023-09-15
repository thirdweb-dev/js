#!/usr/bin/env bash

set -e

echo "Setting up environment..."

# check if pnpm is installed
if ! command -v bun &> /dev/null
then
    echo "⌛️ \"bun\" seems to not be installed, installing it now..."
    # if not, install it using npm
    curl -fsSL https://bun.sh/install | bash
    fi
else 
    # if it is, just confirm that to the user
    echo "✅ \"bun\" is already installed"
fi

# after all of that we'll want to re-install dependencies using pnpm
echo "⌛️ Installing dependencies using \"bun\"..."
bun install
echo "✅ Installed dependencies using \"bun\""

# we're finished
echo "✅ Environment setup complete"