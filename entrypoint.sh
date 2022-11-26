#!/usr/bin/env sh

set -e

# Database Migration & Seeding
node init-aws.js
# cp /.env ./dist
yarn prisma:migrate:deploy
"$@"
