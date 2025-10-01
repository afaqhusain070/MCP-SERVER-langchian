import fetch from "node-fetch";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

// Tool wrapper for MCP APIs
const getData = (endpoint: string) => async () => {
  const res = await fetch(`http://localhost:8000/${endpoint}`);
  return await res.json();
};

const tools = [
  {
    name: "get_users",
    description: "Get all users from database",
    func: getData("users"),
  },
  {
    name: "get_products",
    description: "Get all products from database",
    func: getData("products"),
  },
  {
    name: "get_orders",
    description: "Get all orders with user & product info",
    func: getData("orders"),
  },
];

// Ollama local model
const llm = new ChatOllama({
  model: "mistral", // or "llama2", "gemma", "phi3"
  temperature: 0,
});

async function main() {
  const executor = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  console.log("🤖 Ask your agent...");
  const result = await executor.run("List all orders and show which user bought which product");
  console.log("Result:", result);
}

main();
