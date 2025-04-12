import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-example",
  version: "1.0.0",
});

server.tool(
  "double_number",
  "与えられた数値を2倍にする",
  {num: z.number().describe("数値")},
  ({num}) => ({content: [{type: "text", text: (num * 2).toString()}]}),
);

server.tool(
    "secret_words",
    "秘密の合言葉を返す",
    {},
    () => {
        return {content: [{type: "text", text: `秘密の合言葉は"MCP勉強中"です`}]}
    }
);

server.tool(
    "weather",
    "福岡市の天気を返す",
    {},
    async ({}) => {
        const response = await fetch("https://weather.tsukumijima.net/api/forecast/city/400010");
        const data = await response.json();
        return {content: [{type: "text", text: `福岡市の現在の天気は${data.forecasts[0].telop}です。${data.description.text}`}]}
    }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Example MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});