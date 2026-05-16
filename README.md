# SerpApi MCP Chat

A web search chat interface powered by [SerpApi](https://serpapi.com/) and the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

Ask a question — the frontend sends it to a FastMCP server which calls SerpApi and returns organic search results.

Built for the **SerpApi PyCon US Raffle** (May 2026).

---

## Stack

| Layer | Stack |
|-------|-------|
| Frontend | Astro 5 (SSR), Tailwind CSS v4 |
| Backend | Python, FastMCP (`mcp[cli]`), SerpApi SDK |
| Package manager | pnpm (Node), pip (Python) |
| Deploy | Standalone Node adapter (`@astrojs/node`) |

---

## Quick Start

### Prerequisites

- [Node.js 23+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Python 3.13+](https://www.python.org/)
- A [SerpApi API key](https://serpapi.com/manage-api-key) (free tier: 250 searches/month)

### 1. Clone and install

```bash
git clone https://github.com/Joe342wise/serpside.git
cd serpside
pnpm install
pip install -r server/requirements.txt
```

### 2. Set your API key

Create a `.env` file in the project root:

```
SERPAPI_API_KEY=your_key_here
```

### 3. Run

```bash
./run.sh
```

This starts both servers in parallel:

- **FastMCP** → `http://localhost:8001/mcp`
- **Chat UI** → `http://localhost:3000`

Open `http://localhost:3000` and start searching.

---

## How it works

1. You type a query in the chat UI
2. Astro's API route (`POST /api/chat`) sends it to the FastMCP server via the MCP streamable HTTP transport
3. The FastMCP server calls SerpApi's Google search engine and returns organic results
4. Results are rendered as cards with links and snippets

---

## Project structure

```
server/
  server.py          — FastMCP server with SerpApi search tool
  requirements.txt   — Python dependencies
src/
  pages/
    index.astro      — Chat UI
    api/chat.ts      — API route that proxies queries to the MCP server
  styles/
    global.css       — Tailwind base styles
astro.config.mjs     — Astro config (SSR, Node adapter, Tailwind)
run.sh               — Launches both servers
```

---

## Raffle Entry

Built by Joseph Osei Yaw Nyarko for the **SerpApi PyCon US Raffle**.

- App: [serpchat.osei.app](https://serpchat.osei.app)
- Repo: [Serp MCP Chat](https://github.com/Joe342wise/MCPChatBot.git)
