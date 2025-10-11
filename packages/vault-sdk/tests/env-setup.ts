import { join } from "node:path";
import { cwd, loadEnvFile } from "node:process";

loadEnvFile(join(cwd(), "tests", ".env"));
