import express from "express";
import { AppDataSource } from "./data-source.js";
import { User } from "./entity/User.js";
import { Product } from "./entity/Product.js";
import { Order } from "./entity/Order.js";

const app = express();
const port = 8000;

AppDataSource.initialize().then(() => {
  console.log("✅ Database connected");

  app.get("/users", async (_, res) => {
    const users = await AppDataSource.getRepository(User).find();
    res.json(users);
  });

  app.get("/products", async (_, res) => {
    const products = await AppDataSource.getRepository(Product).find();
    res.json(products);
  });

  app.get("/orders", async (_, res) => {
    const orders = await AppDataSource.getRepository(Order).find({
      relations: ["user", "product"],
    });
    res.json(orders);
  });

  app.listen(port, () =>
    console.log(`🚀 MCP Server running at http://localhost:${port}`)
  );
});
