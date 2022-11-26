#!/usr/bin/env sh

set -e

# Database Migration & Seeding
node init-aws.js
. ./.env
yarn prisma:migrate:deploy
"$@"
