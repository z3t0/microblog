#!/bin/bash

mkdir -p build
deno compile -A -o build/microblog ./src/main.ts
