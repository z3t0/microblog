#!/bin/bash

mkdir -p build
deno compile -A -o build/microblog ./main.ts
