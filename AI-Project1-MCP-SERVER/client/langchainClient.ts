import fetch from "node-fetch";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

// Define tools properly with schemas and functions

const getUsersTool = tool(
  async () => {
    const res = await fetch("http://localhost:8000/users");
    return await res.json();
  },
  {
    name: "get_users",
    description: "Get all users from database",
    schema: z.object({}), // no input parameters
  }
);

const getProductsTool = tool(
  async () => {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();
    console.log("📦 Products fetched:", data); // debug log
    return data;
  },
  {
    name: "get_products",
    description: "Get all products from database",
    schema: z.object({}), // no input parameters
  }
);

const getOrdersTool = tool(
  async () => {
    const res = await fetch("http://localhost:8000/orders");
    return await res.json()
  },
  {
    name: "get_orders",
    description: "Get all orders with user & product info",
    schema: z.object({}), // no input parameters
  }
);

// Ollama local model (use gemma2:2b for better reasoning)
const llm = new ChatOllama({
  model: "gemma2:2b",
  temperature: 0,
});

async function main() {
  // Pass the array of tool instances to the agent executor
  const executor = await initializeAgentExecutorWithOptions(
    [getUsersTool, getProductsTool, getOrdersTool],
    llm,
    {
      agentType: "zero-shot-react-description",
      verbose: true,
    }
  );

  console.log("🤖 Ask your agent...");
  const result = await executor.invoke({
    input: "show only products with price > 500"
  });

  console.log("✅ Final Result:", result.output);
}

main();
