const fs = require("fs");

const volumeDb = "/app/data/data.db"; // Railway volume path
const repoDb = __dirname + "/data-seed/data.db"; // your repo DB path (adjust if needed)

if (!fs.existsSync(volumeDb)) {
  console.log("Seeding DB into Railway volume...");
  fs.mkdirSync("/app/data", { recursive: true });
  fs.copyFileSync(repoDb, volumeDb);
  console.log("Done.");
} else {
  console.log("Volume DB already exists. Skipping seed.");
}
