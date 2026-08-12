import fs from "fs";
import path from "path";

// Read .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

import { connectToDatabase } from "../src/lib/mongodb";
import { Vehicle } from "../src/models/Vehicle";
import { User } from "../src/models/User";

async function testSearch() {
  try {
    console.log("Connecting to MongoDB...");
    await connectToDatabase();
    console.log("Connected! Registering models...");
    
    // Explicitly reference User model
    const userCount = await User.countDocuments();
    console.log(`User collection has ${userCount} users.`);

    const normQuery = "HR51CE6002";
    console.log(`Searching for vehicles matching plate: ${normQuery}...`);

    let vehicles = await Vehicle.find({
      plateNumber: { $regex: normQuery, $options: "i" },
    })
      .populate("ownerId", "name phone role tower flatNumber isVerified")
      .limit(5)
      .lean();

    console.log("Found vehicles count:", vehicles.length);
    console.log("Found vehicles:", JSON.stringify(vehicles, null, 2));
  } catch (err: any) {
    console.error("SEARCH ERROR CATCH:", err);
  }
  process.exit(0);
}

testSearch();
