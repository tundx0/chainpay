const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

function generateSecureString(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

function main() {
  const envPath = path.join(__dirname, "../.env.production");

  const force = process.argv.includes("--force") || process.argv.includes("-f");

  if (fs.existsSync(envPath) && !force) {
    console.log(
      "⚠️  .env.production already exists. Skipping generation to prevent overwriting.",
    );
    console.log(
      "If you want to generate a new one, run with the --force flag or delete the existing file.",
    );
    process.exit(0);
  }

  console.log("Generating production credentials...");

  const dbPassword = generateSecureString(16);
  const eventKey = generateSecureString(32);
  const signingKey = generateSecureString(32);
  const dashboardPassword = generateSecureString(12);

  let dashboardPasswordHash = "";
  try {
    console.log(
      "Generating Caddy bcrypt hash for dashboard password using Docker...",
    );
    const cmd = `docker run --rm caddy:2-alpine caddy hash-password --plaintext "${dashboardPassword}"`;
    dashboardPasswordHash = execSync(cmd, { encoding: "utf-8" }).trim();
  } catch (error) {
    console.warn(
      "⚠️  Could not run Docker to generate Caddy password hash. You will need to hash it manually.",
    );
    console.warn("Plaintext password: " + dashboardPassword);
    console.warn(
      'To generate the hash, run: docker run --rm caddy:2-alpine caddy hash-password --plaintext "' +
        dashboardPassword +
        '"',
    );
    dashboardPasswordHash = "PLACEHOLDER_HASH_GENERATE_MANUALLY";
  }

  const envContent = `# Database Secrets
DB_PASSWORD=${dbPassword}

# Inngest Internal Communication Keys
INNGEST_EVENT_KEY=${eventKey}
INNGEST_SIGNING_KEY=${signingKey}

# Domains Configuration
API_DOMAIN=api.nodecheckout.com
INNGEST_DOMAIN=inngest.nodecheckout.com

# Alchemy / EVM RPC URLs (set the networks you use; leave unused ones empty)
RPC_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
RPC_BASE_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
RPC_ETHEREUM_URL=
RPC_POLYGON_URL=
RPC_ARBITRUM_URL=

# Inngest Dashboard Credentials
INNGUEST_DASHBOARD_PASSWORD_CLEARTEXT=${dashboardPassword}
INNGUEST_DASHBOARD_PASSWORD_HASH=${dashboardPasswordHash}
`;

  fs.writeFileSync(envPath, envContent, "utf-8");

  console.log("✅ Created .env.production successfully!");
  console.log("\n--- GENERATED PRODUCTION CREDENTIALS ---");
  console.log("Database Password:          " + dbPassword);
  console.log("Inngest Event Key:          " + eventKey);
  console.log("Inngest Signing Key:        " + signingKey);
  console.log("Inngest Dashboard User:     admin");
  console.log("Inngest Dashboard Password: " + dashboardPassword);
  if (dashboardPasswordHash !== "PLACEHOLDER_HASH_GENERATE_MANUALLY") {
    console.log("Caddy Bcrypt Hash:          " + dashboardPasswordHash);
  }
  console.log("----------------------------------------");
  console.log(
    "\n⚠️  Store these credentials securely and never commit .env.production to source control.",
  );
}

main();
