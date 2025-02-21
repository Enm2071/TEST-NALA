// seed.ts
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import CardNode from "../src/models/orgCard.model";

const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:admin@localhost:27017/orgCard?authSource=admin";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    seedDatabase();
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

async function seedDatabase() {
  try {
    await CardNode.deleteMany({});

    const initialNode = new CardNode({
      id: 1,
      title: "Gerente",
      children: [],
      root: true,
    });
    
    await initialNode.save();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
}
