import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

console.log("Starting MongoDB test...");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

const configuredUri = process.env.MONGO_URI?.trim();
const credentialsEnd = configuredUri.lastIndexOf("@");
const databaseStart = configuredUri.indexOf("/", credentialsEnd);
const credentials = configuredUri.slice("mongodb://".length, credentialsEnd);
const firstHost = configuredUri
  .slice(credentialsEnd + 1, databaseStart)
  .split(",")[0]
  .split(":")[0];
const srvDomain = firstHost.replace(/^ac-[^.]+-shard-\d+-\d+\./, "");
const mongoUri = configuredUri.startsWith("mongodb://")
  ? `mongodb+srv://${credentials}@${srvDomain}${configuredUri.slice(databaseStart)}`
  : configuredUri;

const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  tls: true,
});

try {
  await client.connect();

  console.log("MONGODB CONNECTED SUCCESSFULLY");

  const result = await client.db("campusconnect").command({
    ping: 1,
  });

  console.log("PING RESULT:", result);

  await client.close();

  console.log("MongoDB test completed.");
} catch (error) {
  console.log("MONGODB CONNECTION FAILED");
  console.log("Error name:", error.name);
  console.log("Error message:", error.message);

  if (error.cause) {
    console.log("Cause:", error.cause.message);
  }
}