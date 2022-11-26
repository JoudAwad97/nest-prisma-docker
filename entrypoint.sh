#!/usr/bin/env sh

set -e

# Database Migration & Seeding
yarn prisma:migrate:deploy
"$@"
