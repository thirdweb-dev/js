import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseAbiItem } from "abitype";
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

  const uri = await buildStylus(spinner, secretKey);

  const url = getUrl(uri, "publish").toString();
  spinner.succeed(`Upload complete, navigate to ${url}`);
  await open(url);
}

export async function deployStylus(secretKey?: string) {
  const spinner = ora("Checking if this is a Stylus project...").start();

  checkPrerequisites(spinner, "cargo", ["--version"], "Rust (cargo)");
  checkPrerequisites(spinner, "rustc", ["--version"], "Rust compiler (rustc)");

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

    // Step 3: Run stylus command to generate abi (plain Solidity, no solc needed)
    spinner.start("Generating ABI...");
    const abiResult = spawnSync("cargo", ["stylus", "export-abi"], {
      encoding: "utf-8",
    });
    if (abiResult.status !== 0) {
      spinner.fail("Failed to generate ABI.");
      process.exit(1);
    }

    const solidityOutput = abiResult.stdout.trim();
    if (!solidityOutput) {
      spinner.fail("Failed to generate ABI.");
      process.exit(1);
    }

    const interfaces = parseSolidityInterfaces(solidityOutput);
    if (interfaces.length === 0) {
      spinner.fail("No interfaces found in ABI output.");
      process.exit(1);
    }
    spinner.succeed("ABI generated.");

    // Step 3.5: detect the constructor
    spinner.start("Detecting constructor\u2026");
    const constructorResult = spawnSync("cargo", ["stylus", "constructor"], {
      encoding: "utf-8",
    });

    if (constructorResult.status !== 0) {
      spinner.fail("Failed to get constructor signature.");
      process.exit(1);
    }

    const constructorSigRaw = constructorResult.stdout.trim();
    spinner.succeed(`Constructor found: ${constructorSigRaw || "none"}`);

    // Step 4: Process the output
    let selectedIndex = 0;

    if (interfaces.length > 1) {
      const response = await prompts({
        choices: interfaces.map((iface, idx) => ({
          title: iface.name,
          value: idx,
        })),
        message: "Select entrypoint:",
        name: "contract",
        type: "select",
      });

      if (typeof response.contract !== "number") {
        spinner.fail("No contract selected.");
        process.exit(1);
      }

      selectedIndex = response.contract;
    }

    const selectedInterface = interfaces[selectedIndex];
    if (!selectedInterface) {
      spinner.fail("No interface found.");
      process.exit(1);
    }

    const selectedContractName = selectedInterface.name.replace(/^I/, "");
    // biome-ignore lint/suspicious/noExplicitAny: ABI is untyped JSON from parseAbiItem
    const abiArray: any[] = selectedInterface.abi;

    const constructorAbi = constructorSigToAbi(constructorSigRaw);
    if (
      constructorAbi &&
      // biome-ignore lint/suspicious/noExplicitAny: ABI entries have varying shapes
      !abiArray.some((e: any) => e.type === "constructor")
    ) {
      abiArray.unshift(constructorAbi);
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

// biome-ignore lint/suspicious/noExplicitAny: ABI items from parseAbiItem are untyped
type AbiEntry = any;
type ParsedInterface = { name: string; abi: AbiEntry[] };

function parseSolidityInterfaces(source: string): ParsedInterface[] {
  const results: ParsedInterface[] = [];

  const ifaceRegex = /interface\s+(I?[A-Za-z0-9_]+)\s*\{([\s\S]*?)\n\}/g;
  for (
    let ifaceMatch = ifaceRegex.exec(source);
    ifaceMatch !== null;
    ifaceMatch = ifaceRegex.exec(source)
  ) {
    const name = ifaceMatch[1] ?? "";
    const body = ifaceMatch[2] ?? "";
    const abi: AbiEntry[] = [];

    // Build struct lookup: name -> tuple type string
    const structs = new Map<string, string>();
    const structRegex = /struct\s+(\w+)\s*\{([^}]*)\}/g;
    for (
      let structMatch = structRegex.exec(body);
      structMatch !== null;
      structMatch = structRegex.exec(body)
    ) {
      const fields = (structMatch[2] ?? "")
        .split(";")
        .map((f) => f.trim())
        .filter(Boolean)
        .map((f) => f.split(/\s+/)[0] ?? "");
      structs.set(structMatch[1] ?? "", `(${fields.join(",")})`);
    }

    // Resolve struct references in a type string (iterative for nested structs)
    const resolveStructs = (sig: string): string => {
      let resolved = sig;
      for (let i = 0; i < 10; i++) {
        let changed = false;
        for (const [sName, sTuple] of structs) {
          const re = new RegExp(`\\b${sName}\\b(\\[\\])?`, "g");
          const next = resolved.replace(
            re,
            (_, arr) => `${sTuple}${arr ?? ""}`,
          );
          if (next !== resolved) {
            resolved = next;
            changed = true;
          }
        }
        if (!changed) break;
      }
      return resolved;
    };

    // Extract each statement (function/error/event) delimited by ;
    const statements = body
      .split(";")
      .map((s) => s.replace(/\n/g, " ").trim())
      .filter(
        (s) =>
          s.startsWith("function ") ||
          s.startsWith("error ") ||
          s.startsWith("event "),
      );

    for (const stmt of statements) {
      // Strip Solidity qualifiers that abitype doesn't expect
      let cleaned = stmt
        .replace(/\b(external|public|internal|private)\b/g, "")
        .replace(/\b(memory|calldata|storage)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();

      // Resolve struct type names to tuple types
      cleaned = resolveStructs(cleaned);

      try {
        const parsed = parseAbiItem(cleaned);
        abi.push(parsed);
      } catch {
        // Skip unparseable items
      }
    }

    results.push({ abi, name });
  }

  return results;
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
