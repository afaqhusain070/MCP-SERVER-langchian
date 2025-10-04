import "reflect-metadata";

import { AppDataSource } from "./data-source.js";
import { User } from "./entity/User.js";
import { Product } from "./entity/Product.js";
import { Order } from "./entity/Order.js";


async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);
  const orderRepo = AppDataSource.getRepository(Order);

  // Users
  const usersData = [
    { name: "Ali Khan", email: "ali@example.com", age: 30 },
    { name: "Sara Ahmed", email: "sara@example.com", age: 28 },
    { name: "Bilal Hussain", email: "bilal@example.com", age: 35 },
  ];
  const users = usersData.map((data) => userRepo.create(data));
  await userRepo.save(users);

  // Products
  const products = productRepo.create([
    { name: "Laptop", price: 1200 },
    { name: "Smartphone", price: 800 },
    { name: "Headphones", price: 150 },
  ]);
  await productRepo.save(products);

  // Orders
  const orders = orderRepo.create([
    { user: users[0], product: products[0] },
    { user: users[1], product: products[1] },
    { user: users[2], product: products[2] },
    { user: users[0], product: products[2] },
  ]);
  await orderRepo.save(orders);

  console.log("✅ Seed data inserted");
  process.exit(0);
}

seed();
