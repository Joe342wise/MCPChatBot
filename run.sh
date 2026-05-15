#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== Starting SerpApi MCP Chat ==="

if [ -f "$ROOT/.env" ]; then
  set -a; source "$ROOT/.env"; set +a
fi

if [ -z "$SERPAPI_API_KEY" ]; then
  echo "ERROR: SERPAPI_API_KEY environment variable is not set."
  echo "Get your key at https://serpapi.com/manage-api-key"
  exit 1
fi

echo "[1/2] Starting FastMCP server on :8001..."
cd "$ROOT/server"
python3 server.py &
MCP_PID=$!

echo "[2/2] Starting Astro dev server on :3000..."
cd "$ROOT"
pnpm run dev &
ASTRO_PID=$!

echo ""
echo "  FastMCP  → http://localhost:8001/mcp"
echo "  Chat UI  → http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $MCP_PID $ASTRO_PID 2>/dev/null; exit 0" INT TERM
wait
