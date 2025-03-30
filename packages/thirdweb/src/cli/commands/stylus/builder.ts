import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import open from "open";
import ora, { type Ora } from "ora";
import { parse } from "toml";
import { createThirdwebClient } from "../../../client/client.js";
import { upload } from "../../../storage/upload.js";

const THIRDWEB_URL = "https://thirdweb.com";

export async function publishStylus(secretKey?: string) {
  const spinner = ora("Checking if this is a Stylus project...").start();
  const uri = await buildStylus(spinner, secretKey);

  const url = getUrl(uri, "publish").toString();
  spinner.succeed(`Upload complete, navigate to ${url}`);
  await open(url);
}

export async function deployStylus(secretKey?: string) {
  const spinner = ora("Checking if this is a Stylus project...").start();
  const uri = await buildStylus(spinner, secretKey);

  const url = getUrl(uri, "deploy").toString();
  spinner.succeed(`Upload complete, navigate to ${url}`);
  await open(url);
}

async function buildStylus(spinner: Ora, secretKey?: string) {
  if (!secretKey) {
    spinner.fail(
      "Error: Secret key is required. Please pass it via the -k parameter.",
    );
    process.exit(1);
  }

  try {
    // Step 1: Validate stylus project
    const root = process.cwd();
    if (!root) {
      spinner.fail("Error: No package directory found.");
      process.exit(1);
    }

    const cargoTomlPath = join(root, "Cargo.toml");
    if (!existsSync(cargoTomlPath)) {
      spinner.fail("Error: No Cargo.toml found. Not a Stylus/Rust project.");
      process.exit(1);
    }

    const cargoToml = readFileSync(cargoTomlPath, "utf8");
    const parsedCargoToml = parse(cargoToml);
    if (!parsedCargoToml.dependencies?.["stylus-sdk"]) {
      spinner.fail(
        "Error: Not a Stylus project. Missing stylus-sdk dependency.",
      );
      process.exit(1);
    }

    spinner.succeed("Stylus project detected.");

    // Step 2: Run stylus command to generate initcode
    spinner.start("Generating initcode...");
    const initcodeResult = spawnSync("cargo", ["stylus", "get-initcode"], {
      encoding: "utf-8",
    });
    if (initcodeResult.status !== 0) {
      spinner.fail("Failed to generate initcode.");
      process.exit(1);
    }

    const initcode = extractBytecode(initcodeResult.stdout);
    if (!initcode) {
      spinner.fail("Failed to generate initcode.");
      process.exit(1);
    }
    spinner.succeed("Initcode generated.");

    // Step 3: Run stylus command to generate abi
    spinner.start("Generating ABI...");
    const abiResult = spawnSync("cargo", ["stylus", "export-abi", "--json"], {
      encoding: "utf-8",
    });
    if (abiResult.status !== 0) {
      spinner.fail("Failed to generate ABI.");
      process.exit(1);
    }

    const abiContent = abiResult.stdout.trim();
    if (!abiContent) {
      spinner.fail("Failed to generate ABI.");
      process.exit(1);
    }
    spinner.succeed("ABI generated.");

    // Step 4: Process the output
    const contractName = extractContractNameFromExportAbi(abiContent);
    if (!contractName) {
      spinner.fail("Error: Could not determine contract name from ABI output.");
      process.exit(1);
    }

    let cleanedAbi = "";
    try {
      const jsonMatch = abiContent.match(/\[.*\]/s);
      if (jsonMatch) {
        cleanedAbi = jsonMatch[0];
      } else {
        throw new Error("No valid JSON ABI found in the file.");
      }
    } catch (error) {
      spinner.fail("Error: ABI file contains invalid format.");
      console.error(error);
      process.exit(1);
    }

    const metadata = {
      compiler: {},
      language: "rust",
      output: {
        abi: JSON.parse(cleanedAbi),
        devdoc: {},
        userdoc: {},
      },
      settings: {
        compilationTarget: {
          "src/main.rs": contractName,
        },
      },
      sources: {},
    };
    spinner.succeed("Stylus contract exported successfully.");

    // Step 5: Upload to IPFS
    spinner.start("Uploading to IPFS...");
    const client = createThirdwebClient({
      secretKey,
    });

    const metadataUri = await upload({
      client,
      files: [metadata],
    });

    const bytecodeUri = await upload({
      client,
      files: [initcode],
    });

    const uri = await upload({
      client,
      files: [
        {
          name: contractName,
          metadataUri,
          bytecodeUri,
          analytics: {
            command: "publish-stylus",
            contract_name: contractName,
            cli_version: "",
            project_type: "stylus",
          },
          compilers: {
            stylus: [
              { compilerVersion: "", evmVersion: "", metadataUri, bytecodeUri },
            ],
          },
        },
      ],
    });
    spinner.succeed("Upload complete");

    return uri;
  } catch (error) {
    spinner.fail(`Error: ${error}`);
    process.exit(1);
  }
}

function extractContractNameFromExportAbi(abiRawOutput: string): string | null {
  const match = abiRawOutput.match(/<stdin>:(I[A-Za-z0-9_]+)/);
  if (match?.[1]) {
    return match[1].replace(/^I/, "");
  }
  return null;
}

function getUrl(hash: string, command: string) {
  const url = new URL(
    `${THIRDWEB_URL}/contracts/${command}/${encodeURIComponent(hash.replace("ipfs://", ""))}`,
  );

  return url;
}

function extractBytecode(rawOutput: string): string {
  const hexStart = rawOutput.indexOf("7f000000");
  if (hexStart === -1) {
    throw new Error("Could not find start of bytecode");
  }
  return rawOutput.slice(hexStart).trim();
}
