
// upload-db-cloudinary.js
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { execSync } = require("child_process");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Railway volume path
const volumeDb = "/app/data/data.db";

// Debug — find all DB files
try {
  console.log("🔍 Searching for all data.db files...");
  const list = execSync("find /app -name 'data.db' 2>/dev/null").toString();
  console.log(list);
} catch (e) {}

async function uploadDb() {
  if (!fs.existsSync(volumeDb)) {
    console.error("❌ Volume DB not found at", volumeDb);
    process.exit(1);
  }

  console.log("📏 DB Size:", fs.statSync(volumeDb).size);
  console.log("📤 Uploading VOLUME DB → Cloudinary...");

  try {
    const result = await cloudinary.uploader.upload(volumeDb, {
      folder: "strapi-db-backups",
      resource_type: "raw",
      public_id: `backup-${Date.now()}`,
    });

    console.log("🎉 Upload successful!");
    console.log("🔗 Cloudinary URL:", result.secure_url);
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}


uploadDb();
