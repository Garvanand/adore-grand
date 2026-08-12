import { hashPassword } from "../src/lib/auth/password";
import { connectToDatabase } from "../src/lib/mongodb";
import { User } from "../src/models/User";
import { Vehicle } from "../src/models/Vehicle";
import { Incident } from "../src/models/Incident";
import { ParkingZone } from "../src/models/ParkingZone";

async function seedDatabase() {
  console.log("--------------------------------------------------");
  console.log("🌱 Seeding AdorePark MongoDB Atlas Database...");
  console.log("--------------------------------------------------");

  await connectToDatabase();

  // 1. Seed Parking Zones (T1-T7, MANDIR, PARK_BOUNDARY, OTHER)
  const defaultZones = [
    { code: "T1", name: "Tower T1", description: "Tower 1 Basement & Driveway" },
    { code: "T2", name: "Tower T2", description: "Tower 2 Reserved Slots" },
    { code: "T3", name: "Tower T3", description: "Tower 3 Parking Area" },
    { code: "T4", name: "Tower T4", description: "Tower 4 Resident Slots" },
    { code: "T5", name: "Tower T5", description: "Tower 5 Parking Zone" },
    { code: "T6", name: "Tower T6", description: "Tower 6 Driveway" },
    { code: "T7", name: "Tower T7", description: "Tower 7 Visitor & Resident Slots" },
    { code: "MANDIR", name: "Mandir Side", description: "Society Mandir Front Parking" },
    { code: "PARK_BOUNDARY", name: "Park Boundary", description: "Central Park Perimeter Parking" },
    { code: "OTHER", name: "Other Boundary Parking", description: "General Society Perimeter Parking" },
  ];

  for (const zone of defaultZones) {
    await ParkingZone.findOneAndUpdate(
      { code: zone.code },
      { ...zone, isActive: true },
      { upsert: true, new: true }
    );
  }
  console.log("✅ Seeded 10 Adore Grand Parking Zones (T1-T7, MANDIR, PARK_BOUNDARY, OTHER)");

  // 2. Hash Super Admin Password: garvanand03 / Garv@516002
  const superAdminPasswordHash = hashPassword("Garv@516002");

  await User.deleteOne({ $or: [{ username: "garvanand03" }, { phone: "+919999900000" }] });

  const superAdmin = await User.create({
    username: "garvanand03",
    passwordHash: superAdminPasswordHash,
    phone: "+919999900000",
    name: "Garv Anand (Super Admin)",
    role: "super_admin",
    tower: "T1",
    flatNumber: "1401",
    isVerified: true,
    status: "active",
  });
  console.log("✅ Seeded Super Admin User: garvanand03");

  // 3. Seed Security Guard User
  const guardPasswordHash = hashPassword("Guard@123456");
  const guardUser = await User.findOneAndUpdate(
    { phone: "+919800011122" },
    {
      phone: "+919800011122",
      username: "guard_gate1",
      passwordHash: guardPasswordHash,
      name: "Ramesh Kumar (Gate 1 Guard)",
      role: "security",
      tower: "Gate 1",
      flatNumber: "Security Desk",
      isVerified: true,
      status: "active",
    },
    { upsert: true, new: true }
  );
  console.log("✅ Seeded Security Guard Account: Ramesh Kumar");

  // 4. Seed Test Residents
  const resident1 = await User.findOneAndUpdate(
    { phone: "+919876543210" },
    {
      phone: "+919876543210",
      name: "Vikram Sharma",
      role: "resident",
      tower: "T1",
      flatNumber: "1204",
      isVerified: true,
      status: "active",
    },
    { upsert: true, new: true }
  );

  const resident2 = await User.findOneAndUpdate(
    { phone: "+919811223344" },
    {
      phone: "+919811223344",
      name: "Ananya Verma",
      role: "resident",
      tower: "T3",
      flatNumber: "502",
      isVerified: true,
      status: "active",
    },
    { upsert: true, new: true }
  );

  const resident3 = await User.findOneAndUpdate(
    { phone: "+919899001122" },
    {
      phone: "+919899001122",
      name: "Rajesh Malhotra",
      role: "resident",
      tower: "T5",
      flatNumber: "804",
      isVerified: true,
      status: "active",
    },
    { upsert: true, new: true }
  );
  console.log("✅ Seeded Test Residents across Towers T1, T3, T5");

  // 5. Seed Vehicles
  const vehiclesData = [
    {
      plateNumber: "HR26AB1234",
      rawPlateNumber: "HR 26 AB 1234",
      ownerId: resident1._id,
      vehicleType: "car",
      makeModel: "White Honda City",
      color: "White",
      tower: "T1",
      flatNumber: "1204",
      parkingSlot: "T1-B1-04",
      parkingZone: "T1",
    },
    {
      plateNumber: "HR38X9988",
      rawPlateNumber: "HR 38 X 9988",
      ownerId: resident2._id,
      vehicleType: "car",
      makeModel: "Silver Hyundai Creta",
      color: "Silver",
      tower: "T3",
      flatNumber: "502",
      parkingSlot: "T3-B2-12",
      parkingZone: "T3",
    },
    {
      plateNumber: "DL3CBT5544",
      rawPlateNumber: "DL 3C BT 5544",
      ownerId: resident3._id,
      vehicleType: "bike",
      makeModel: "Royal Enfield Bullet",
      color: "Black",
      tower: "T5",
      flatNumber: "804",
      parkingSlot: "T5-G02",
      parkingZone: "T5",
    },
  ];

  for (const vData of vehiclesData) {
    await Vehicle.findOneAndUpdate(
      { plateNumber: vData.plateNumber },
      { ...vData, status: "active" },
      { upsert: true, new: true }
    );
  }
  console.log("✅ Seeded Test Vehicles: HR26AB1234, HR38X9988, DL3CBT5544");

  console.log("==================================================");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("Super Admin Credentials: garvanand03 / Garv@516002");
  console.log("==================================================");
  process.exit(0);
}

seedDatabase().catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
