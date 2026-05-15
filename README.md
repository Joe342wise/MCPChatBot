# SerpApi MCP Chat Bot

A web chat interface powered by **SerpApi** + **FastMCP** — ask questions and get real-time web search results.

## Architecture

```
Browser ──fetch──▶ Astro (/api/chat) ──MCP JSON-RPC──▶ FastMCP Server ──serpapi SDK──▶ serpapi.com
```

## Quick Start

### 1. Get a SerpApi key

Sign up at https://serpapi.com/users/sign_up (250 free searches) and get your key at https://serpapi.com/manage-api-key

### 2. Set your API key

```bash
export SERPAPI_API_KEY=your_key_here
```

### 3. Install Python dependencies

```bash
cd server
pip install -r requirements.txt
```

### 4. Install Node.js dependencies

```bash
npm install
```

### 5. Start both servers

**Terminal 1 — FastMCP server:**

```bash
cd server
python server.py
```

**Terminal 2 — Astro dev server:**

```bash
npm run dev
```

Or use the convenience script:

```bash
chmod +x run.sh
./run.sh
```

### 6. Open the chat

Visit **http://localhost:3000** and start searching.

## How It Works

1. You type a query into the chat UI
2. Astro API route receives the POST request
3. It sends MCP JSON-RPC messages to the FastMCP server (`localhost:8001/mcp`)
4. FastMCP calls SerpApi's Python SDK to search Google
5. Results flow back through the chain to the browser

## Raffle Compliance

- ✅ Uses SerpApi Python SDK
- ✅ Built with FastMCP (MCP protocol)
- ✅ Public GitHub repo with code + setup instructions
- ✅ Working interactive prototype
