#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ENV_FILE:-.env.production}"
COMPOSE_FILE="docker-compose.prod.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Missing $ENV_FILE"
  echo "   Run: node scripts/generate-env.js"
  exit 1
fi

if ! grep -q '^DB_PASSWORD=.\+' "$ENV_FILE"; then
  echo "❌ DB_PASSWORD is empty in $ENV_FILE"
  exit 1
fi

echo "Using env file: $ENV_FILE"

if [[ "${1:-}" == "up" ]]; then
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d postgres redis
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm migrate
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d "${@:2}"
  exit 0
fi

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
