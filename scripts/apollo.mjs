// @ts-check

import { execa } from "execa";
import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

dotenv.config();
const ADMIN_SECRET = process.env.PAYMENTS_ADMIN_SECRET;
const API_URL = process.env.NEXT_PUBLIC_PAYMENTS_API;
async function doit() {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_PAYMENTS_API is not defined");
    process.exit(1);
  }
  if (!ADMIN_SECRET) {
    console.error("PAYMENTS_ADMIN_SECRET is not defined");
    process.exit(1);
  }

  const headerValue = `X-Hasura-Admin-Secret: ${ADMIN_SECRET}`;
  const headerArg =
    process.platform === "win32" ? `"${headerValue}"` : headerValue;
  const command = process.platform === "win32" ? "gq.cmd" : "gq";
  const args = [
    API_URL,
    "--header",
    headerArg,
    "--introspect",
    "--format",
    "json",
  ];
  const { stdout, stderr, exitCode } = await execa(command, args, {
    shell: process.platform === "win32",
  });
  if (exitCode !== 0) {
    console.error(stderr);
    process.exit(exitCode);
  }
  // ensure schema file exists
  if (!existsSync("./graphql")) {
    await mkdir("./graphql");
  }

  await writeFile("./graphql/schema.json", stdout);
}

doit();
