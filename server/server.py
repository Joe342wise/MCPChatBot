import os
from pathlib import Path
from typing import TypedDict

from dotenv import load_dotenv
from serpapi import Client
from mcp.server.fastmcp import FastMCP

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

mcp = FastMCP("SerpApi Search Server", port=8001)


class SearchResult(TypedDict):
    title: str
    link: str
    snippet: str


@mcp.tool()
def search(q: str) -> list[SearchResult] | str:
    api_key = os.environ.get("SERPAPI_API_KEY")
    if not api_key:
        return "Error: SERPAPI_API_KEY environment variable not set"

    client = Client(api_key=api_key)
    results = client.search(params={"q": q, "engine": "google"})

    organic = results.get("organic_results", [])
    if not organic:
        return "No results found."

    return [
        SearchResult(
            title=r.get("title", ""),
            link=r.get("link", ""),
            snippet=r.get("snippet", ""),
        )
        for r in organic[:5]
    ]


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
