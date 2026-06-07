const fs = require("fs");
const path = require("path");

const SOURCE_PATH = path.join(__dirname, "../dist/index.global.js");
const DEST_DIR = path.join(__dirname, "../../../apps/dashboard/public");
const DEST_PATH = path.join(DEST_DIR, "widget.js");

function copyWidget() {
  try {
    if (!fs.existsSync(SOURCE_PATH)) {
      // Try alternate name without .global
      const altSource = path.join(__dirname, "../dist/index.js");
      if (fs.existsSync(altSource)) {
        if (!fs.existsSync(DEST_DIR)) {
          fs.mkdirSync(DEST_DIR, { recursive: true });
        }
        fs.copyFileSync(altSource, DEST_PATH);
        console.log(`🚀 Copied widget script to ${DEST_PATH}`);
        return;
      }
      console.error(`❌ Source widget script not found at ${SOURCE_PATH}`);
      process.exit(1);
    }

    if (!fs.existsSync(DEST_DIR)) {
      fs.mkdirSync(DEST_DIR, { recursive: true });
    }
    fs.copyFileSync(SOURCE_PATH, DEST_PATH);
    console.log(`🚀 Copied widget script to ${DEST_PATH}`);
  } catch (error) {
    console.error("❌ Failed to copy widget script:", error);
    process.exit(1);
  }
}

copyWidget();
