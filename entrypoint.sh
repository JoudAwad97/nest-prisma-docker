#!/usr/bin/env sh

set -e

# Database Migration & Seeding
source /prisma-api/.env

yarn prisma:migrate:deploy
"$@"
