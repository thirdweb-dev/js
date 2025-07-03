import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import open from "open";
import ora, { type Ora } from "ora";
import prompts from "prompts";
import { parse } from "toml";
import { createThirdwebClient } from "../../../client/client.js";
import { upload } from "../../../storage/upload.js";
import { checkPrerequisites } from "./check-prerequisites.js";

const THIRDWEB_URL = "https://thirdweb.com";

export async function publishStylus(secretKey?: string) {
  const spinner = ora("Checking if this is a Stylus project...").start();

  checkPrerequisites(spinner, "cargo", ["--version"], "Rust (cargo)");
  checkPrerequisites(spinner, "rustc", ["--version"], "Rust compiler (rustc)");
  checkPrerequisites(
    spinner,
    "solc",
    ["--version"],
    "Solidity compiler (solc)",
  );

  const uri = await buildStylus(spinner, secretKey);

  const url = getUrl(uri, "publish").toString();
  spinner.succeed(`Upload complete, navigate to ${url}`);
  await open(url);
}

export async function deployStylus(secretKey?: string) {
  const spinner = ora("Checking if this is a Stylus project...").start();

  checkPrerequisites(spinner, "cargo", ["--version"], "Rust (cargo)");
  checkPrerequisites(spinner, "rustc", ["--version"], "Rust compiler (rustc)");
  checkPrerequisites(
    spinner,
    "solc",
    ["--version"],
    "Solidity compiler (solc)",
  );

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

    // Step 3.5: detect the constructor
    spinner.start("Detecting constructor…");
    const constructorResult = spawnSync("cargo", ["stylus", "constructor"], {
      encoding: "utf-8",
    });

    if (constructorResult.status !== 0) {
      spinner.fail("Failed to get constructor signature.");
      process.exit(1);
    }

    const constructorSigRaw = constructorResult.stdout.trim(); // e.g. "constructor(address owner)"
    spinner.succeed(`Constructor found: ${constructorSigRaw || "none"}`);

    // Step 4: Process the output
    const parts = abiContent.split(/======= <stdin>:/g).filter(Boolean);
    const contractNames = extractContractNamesFromExportAbi(abiContent);

    let selectedContractName: string | undefined;
    let selectedAbiContent: string | undefined;

    if (contractNames.length === 1) {
      selectedContractName = contractNames[0]?.replace(/^I/, "");
      selectedAbiContent = parts[0];
    } else {
      const response = await prompts({
        choices: contractNames.map((name, idx) => ({
          title: name,
          value: idx,
        })),
        message: "Select entrypoint:",
        name: "contract",
        type: "select",
      });

      const selectedIndex = response.contract;

      if (typeof selectedIndex !== "number") {
        spinner.fail("No contract selected.");
        process.exit(1);
      }

      selectedContractName = contractNames[selectedIndex]?.replace(/^I/, "");
      selectedAbiContent = parts[selectedIndex];
    }

    if (!selectedAbiContent) {
      throw new Error("Entrypoint not found");
    }

    if (!selectedContractName) {
      spinner.fail("Error: Could not determine contract name from ABI output.");
      process.exit(1);
    }

    let cleanedAbi = "";
    try {
      const jsonMatch = selectedAbiContent.match(/\[.*\]/s);
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

    // biome-ignore lint/suspicious/noExplicitAny: <>
    const abiArray: any[] = JSON.parse(cleanedAbi);

    const constructorAbi = constructorSigToAbi(constructorSigRaw);
    if (constructorAbi && !abiArray.some((e) => e.type === "constructor")) {
      abiArray.unshift(constructorAbi); // put it at the top for readability
    }

    const metadata = {
      compiler: {},
      language: "rust",
      output: {
        abi: abiArray,
        devdoc: {},
        userdoc: {},
      },
      settings: {
        compilationTarget: {
          "src/main.rs": selectedContractName,
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
          analytics: {
            cli_version: "",
            command: "publish-stylus",
            contract_name: selectedContractName,
            project_type: "stylus",
          },
          bytecodeUri,
          compilers: {
            stylus: [
              { bytecodeUri, compilerVersion: "", evmVersion: "", metadataUri },
            ],
          },
          metadataUri,
          name: selectedContractName,
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

function extractContractNamesFromExportAbi(abiRawOutput: string): string[] {
  return [...abiRawOutput.matchAll(/<stdin>:(I?[A-Za-z0-9_]+)/g)]
    .map((m) => m[1])
    .filter((name): name is string => typeof name === "string");
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

function constructorSigToAbi(sig: string) {
  if (!sig || !sig.startsWith("constructor")) return undefined;

  const sigClean = sig
    .replace(/^constructor\s*\(?/, "")
    .replace(/\)\s*$/, "")
    .replace(/\s+(payable|nonpayable)\s*$/, "");

  const mutability = sig.includes("payable") ? "payable" : "nonpayable";

  const inputs =
    sigClean === ""
      ? []
      : sigClean.split(",").map((p) => {
          const [type, name = ""] = p.trim().split(/\s+/);
          return { internalType: type, name, type };
        });

  return { inputs, stateMutability: mutability, type: "constructor" };
}
