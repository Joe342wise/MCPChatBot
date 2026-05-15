import type { APIRoute } from 'astro';

const MCP_URL = 'http://localhost:8001/mcp';

async function mcpRequest(body: unknown, sessionId?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  };
  if (sessionId) {
    headers['MCP-Session-Id'] = sessionId;
  }

  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const newSessionId = res.headers.get('MCP-Session-Id') || sessionId;
  const text = await res.text();

  const dataLine = text.split('\n').find((l) => l.startsWith('data: '));
  const data = dataLine ? JSON.parse(dataLine.slice(6)) : null;

  return { data, sessionId: newSessionId };
}

export const POST: APIRoute = async ({ request }) => {
  const { query } = await request.json();

  if (!query || typeof query !== 'string') {
    return new Response(JSON.stringify({ error: 'Query string is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { data: initResult, sessionId } = await mcpRequest({
      jsonrpc: '2.0',
      id: '1',
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'serpapi-chat', version: '1.0.0' },
      },
    });

    if (initResult.error) {
      return new Response(JSON.stringify({ error: initResult.error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await mcpRequest(
      {
        jsonrpc: '2.0',
        method: 'notifications/initialized',
      },
      sessionId,
    );

    const { data: toolResult } = await mcpRequest(
      {
        jsonrpc: '2.0',
        id: '2',
        method: 'tools/call',
        params: {
          name: 'search',
          arguments: { q: query },
        },
      },
      sessionId,
    );

    if (toolResult.error) {
      return new Response(JSON.stringify({ error: toolResult.error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sc = toolResult.result?.structuredContent?.result;

    if (Array.isArray(sc)) {
      return new Response(JSON.stringify({ results: sc }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const text =
      typeof sc === 'string'
        ? sc
        : toolResult.result?.content?.[0]?.text || 'No results found.';

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
