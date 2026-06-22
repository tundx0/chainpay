#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ENV_FILE:-.env.production}"
COMPOSE_FILE="docker-compose.prod.yml"

echo "Applying database schema..."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm migrate
echo "✅ Database schema applied"
