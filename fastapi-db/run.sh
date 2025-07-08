#!/bin/bash

# Activate the Python virtual environment
source .venv/bin/activate.fish

# Change directory to src
pushd src || exit 1

# Run uvicorn with reload
uvicorn api:app --reload &

# Return to the original directory
popd

