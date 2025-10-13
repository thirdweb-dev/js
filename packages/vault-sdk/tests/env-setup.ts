import { dirname, join } from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  loadEnvFile(join(__dirname, ".env"));
} catch (_error) {
  console.warn("No .env file found, using default values");
}
