// upload-db-cloudinary.js
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Railway volume DB path
const volumeDb = "/app/data/data.db";

async function uploadDb() {
  if (!fs.existsSync(volumeDb)) {
    console.error("❌ ERROR: DB not found at", volumeDb);
    process.exit(1);
  }

  console.log("📤 Uploading data.db to Cloudinary...");

  try {
    const result = await cloudinary.uploader.upload(volumeDb, {
      folder: "strapi-db-backups",
      resource_type: "raw", // ← REQUIRED for non-media files
      public_id: `backup-${Date.now()}`,
    });

    console.log("🎉 Upload successful!");
    console.log("🔗 File URL:", result.secure_url);
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  }
}

uploadDb();
