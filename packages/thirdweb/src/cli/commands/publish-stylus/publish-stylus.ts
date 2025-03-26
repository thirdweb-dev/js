import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import open from "open";
import ora from "ora";
import { createThirdwebClient } from "../../../client/client.js";
import { upload } from "../../../storage/upload.js";

const THIRDWEB_URL = "https://thirdweb.com";

export async function publishStylus(secretKey?: string) {
  const spinner = ora("Checking if this is a Stylus project...").start();

  if (!secretKey) {
    spinner.fail("Error: Secret key is required.");
    process.exit(1);
  }

  try {
    // Step 1: Validate Stylus project
    const root = process.cwd();
    if (!root) {
      spinner.fail("Error: No package directory found.");
      process.exit(1);
    }

    const cargoTomlPath = join(root, "Cargo.toml");
    if (!existsSync(cargoTomlPath)) {
      spinner.fail("Error: No Cargo.toml found. Not a Rust project.");
      process.exit(1);
    }

    const cargoToml = readFileSync(cargoTomlPath, "utf8");
    if (!cargoToml.includes("[dependencies.stylus-sdk]")) {
      //   spinner.fail("Error: Not a Stylus project. Missing stylus-sdk dependency.");
      //   process.exit(1);
    }

    spinner.succeed("Stylus project detected.");

    // Step 2: Run Stylus export commands
    spinner.start("Exporting initcode...");
    const bytecodeResult = spawnSync("cargo", ["stylus", "export-initcode"], {
      stdio: "inherit",
    });

    if (bytecodeResult.status !== 0) {
      spinner.fail("Failed to export initcode.");
      process.exit(1);
    }
    spinner.succeed("Initcode exported.");

    spinner.start("Exporting ABI...");
    const abiResult = spawnSync(
      "cargo",
      ["stylus", "export-abi", "--json", "--output", "abi.json"],
      { stdio: "inherit" },
    );

    if (abiResult.status !== 0) {
      spinner.fail("Failed to export ABI.");
      process.exit(1);
    }
    spinner.succeed("ABI exported.");

    // Step 3: Read the output files
    const bytecodePath = join(root, "./initcode");
    const abiPath = join(root, "./abi.json");

    if (!existsSync(bytecodePath) || !existsSync(abiPath)) {
      spinner.fail("Error: Export failed. Bytecode or ABI file not found.");
      process.exit(1);
    }
    const abiContent = readFileSync(abiPath, "utf8").trim();

    const contractName = extractContractNameFromExportAbi(abiContent);
    console.log("extracted contract name: ", contractName);
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
      language: "",
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
    writeFileSync(abiPath, JSON.stringify(metadata), "utf8");
    spinner.succeed("ABI cleaned and saved.");

    spinner.succeed("Stylus contract exported successfully.");

    // Step 4: Upload to IPFS (Placeholder)
    spinner.start("Uploading to IPFS...");
    const client = createThirdwebClient({
      secretKey,
    });

    const metadataUri = await upload({
      client,
      files: [metadata],
    });
    console.log(metadataUri);

    const bytecodeContents = readFileSync(bytecodePath, "utf8");

    const bytecodeUri = await upload({
      client,
      files: [bytecodeContents],
    });
    console.log(bytecodeUri);

    const publishUri = await upload({
      client,
      files: [
        {
          name: contractName,
          metadataUri,
          bytecodeUri,
          stylus: true,
        },
      ],
    });

    const url = getUrl(publishUri, "publish").toString();
    spinner.succeed(`Upload complete:, ${url}`);

    await open(url);
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
    `${THIRDWEB_URL}
      /contracts/${command}/
      ${encodeURIComponent(hash.replace("ipfs://", ""))}`,
  );

  return url;
}
