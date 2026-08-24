import { MongoClient } from "mongodb";
import "dotenv/config";

const MONGO_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGO_URI);

export async function conectToMongo() {
  try {
    await client.connect();
    console.log("connected to mongodb...");
    const db = client.db("northProject");

    return db;
  } catch (error) {
    console.error(error.message);
  }
}

export async function closeConnection() {
  client.close();
  console.log("mongo connection closed...");
}
