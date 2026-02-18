#!/bin/bash

REQUIRED_NODE="v24.13.1"
CURRENT_NODE=$(node -v 2>/dev/null)

if [ -z "$CURRENT_NODE" ]; then
  echo "Node.js is not installed."
  exit 1
fi

if [ "$CURRENT_NODE" != "$REQUIRED_NODE" ]; then
  echo "Wrong Node version."
  echo "Required: $REQUIRED_NODE"
  echo "Current:  $CURRENT_NODE"
  echo "If you use nvm, run: nvm use"
  exit 1
fi

echo "Node version verified: $CURRENT_NODE"

echo "Installing dependencies..."
npm ci || exit 1

echo "Running tests..."
npm test || exit 1

echo "Building project..."
npm run build || exit 1

echo "Previewing production build..."
npm run start
