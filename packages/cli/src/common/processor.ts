import { cliVersion, THIRDWEB_URL } from "../constants/urls";
import build from "../core/builder/build";
import detect from "../core/detection/detect";
import { execute } from "../core/helpers/exec";
import { error, info, logger, spinner } from "../core/helpers/logger";
import { createContractsPrompt } from "../core/helpers/selector";
import { ContractPayload } from "../core/interfaces/ContractPayload";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import chalk from "chalk";
import { readFileSync } from "fs";
import ora from "ora";
import path from "path";

export async function processProject(
  options: any,
  command: "deploy" | "release",
) {
  // TODO: allow overriding the default storage
  const storage = new ThirdwebStorage();

  logger.setSettings({
    minLevel: options.debug ? "debug" : "info",
  });

  let projectPath = process.cwd();
  if (options.path) {
    logger.debug("Overriding project path to " + options.path);

    const resolvedPath = (options.path as string).startsWith("/")
      ? options.path
      : path.resolve(`${projectPath}/${options.path}`);
    projectPath = resolvedPath;
  }

  logger.debug("Processing project at path " + projectPath);

  const projectType = await detect(projectPath, options);

  if (projectType === "none") {
    if (command === "deploy") {
      info(
        "No contracts detected in this directory. Redirecting to the thirdweb contract deployment page.",
      );
      return "https://thirdweb.com/contracts";
    }

    error("No detected contracts in this directory.");
    logger.info(``);
    ora(
      `Detected contract files must end with the '.sol' extension and exist in this directory or the '/contracts' subdirectory`,
    ).info();
    logger.info(``);
    ora("To create a new contracts project, run the following command:").info();
    logger.info(``);
    logger.info(`     ${chalk.cyan(`npx thirdweb@latest create --contract`)}`);
    logger.info(``);
    process.exit(1);
  }

  if (options.ci) {
    logger.info("Installing dependencies...");
    try {
      switch (projectType) {
        case "foundry": {
          await execute(`npm install`, projectPath);
          await execute(`forge install`, projectPath);
          break;
        }
        default: {
          await execute(`npm install`, projectPath);
          break;
        }
      }
    } catch (e) {
      logger.warn("Could not install dependencies", e);
    }
  }

  let compiledResult: { contracts: ContractPayload[] };
  const compileLoader = spinner("Compiling project...");
  try {
    compiledResult = await build(projectPath, projectType);
  } catch (e) {
    compileLoader.fail("Compilation failed");
    logger.error(e);
    process.exit(1);
  }
  compileLoader.succeed("Compilation successful");

  if (compiledResult.contracts.length === 0) {
    logger.error(
      "No deployable contract detected. Run with the '--debug' option to see what contracts were skipped and why.",
    );
    process.exit(1);
  }

  let selectedContracts: ContractPayload[] = [];
  if (compiledResult.contracts.length === 1) {
    selectedContracts = [compiledResult.contracts[0]];
    info(
      `Processing contract: ${chalk.blueBright(
        selectedContracts.map((c) => `"${c.name}"`).join(", "),
      )}`,
    );
  } else {
    if (options.ci) {
      selectedContracts = compiledResult.contracts;
    } else {
      const filtered = compiledResult.contracts
        .filter((c) => {
          if (typeof options.file === "string" && options.file.length > 0) {
            return c.fileName.includes(options.file);
          }

          return true;
        })
        .filter((c) => {
          if (
            typeof options.contractName === "string" &&
            options.contractName.length > 0
          ) {
            return c.name.includes(options.contractName);
          }

          return true;
        });

      if (filtered.length === 0) {
        logger.error(`No contracts found matching the specified filters.`);
        process.exit(1);
      }

      const choices = filtered.map((c) => {
        if (
          compiledResult.contracts.filter(
            (other: ContractPayload) => other.name === c.name,
          ).length > 1
        ) {
          return {
            name: `${c.name} - ${chalk.gray(c.fileName)}`,
            value: c,
          };
        }

        return {
          name: c.name,
          value: c,
        };
      });
      const prompt = createContractsPrompt(
        choices,
        `Choose which contract(s) to ${command}`,
      );
      const selection: Record<string, ContractPayload> = await prompt.run();
      selectedContracts = Object.keys(selection).map((key) => selection[key]);
    }
  }

  if (selectedContracts.length === 0) {
    error(
      `No contract selected. Please select at least one contract to ${command}.`,
    );
    process.exit(1);
  }

  if (options.dryRun) {
    info("Dry run, skipping deployment");
    process.exit(0);
  }

  const loader = spinner("Uploading contract data...");

  const soliditySDKPackage = "@thirdweb-dev/contracts";
  let usesSoliditySDK = false;

  try {
    for (let i = 0; i < selectedContracts.length; i++) {
      const contract = selectedContracts[i];
      if (contract.sources) {
        // upload sources in batches to avoid getting rate limited (needs to be single uploads)
        const batchSize = 3;
        for (let j = 0; j < contract.sources.length; j = j + batchSize) {
          const batch = contract.sources.slice(j, j + batchSize);
          logger.debug(`Uploading Sources:\n${batch.join("\n")}\n`);
          await Promise.all(
            batch.map(async (c) => {
              const file = readFileSync(c, "utf-8");
              if (file.includes(soliditySDKPackage)) {
                usesSoliditySDK = true;
              }
              return await storage.upload(file, {
                uploadWithoutDirectory: true,
              });
            }),
          );
        }
      }
    }

    // Upload build output metadatas (need to be single uploads)
    const metadataURIs = await Promise.all(
      selectedContracts.map(async (c) => {
        logger.debug(`Uploading ${c.name}...`);
        return await storage.upload(JSON.parse(JSON.stringify(c.metadata)), {
          uploadWithoutDirectory: true,
        });
      }),
    );

    // Upload batch all bytecodes
    const bytecodes = selectedContracts.map((c) => c.bytecode);
    const bytecodeURIs = await storage.uploadBatch(bytecodes);

    const combinedContents = selectedContracts.map((c, i) => {
      // attach analytics blob to metadata
      const analytics = {
        command,
        contract_name: c.name,
        cli_version: cliVersion,
        project_type: projectType,
        from_ci: options.ci || false,
        uses_contract_extensions: usesSoliditySDK,
      };
      return {
        name: c.name,
        metadataUri: metadataURIs[i],
        bytecodeUri: bytecodeURIs[i],
        analytics,
      };
    });
    let combinedURIs: string[] = [];
    if (combinedContents.length === 1) {
      // use upload single if only one contract to get a clean IPFS hash
      const metadataUri = await storage.upload(combinedContents[0], {
        uploadWithoutDirectory: true,
      });
      combinedURIs.push(metadataUri);
    } else {
      // otherwise upload batch
      combinedURIs = await storage.uploadBatch(combinedContents);
    }

    loader.succeed("Upload successful");

    return getUrl(combinedURIs, command);
  } catch (e) {
    loader.fail("Error uploading metadata");
    throw e;
  }
}

export function getUrl(hashes: string[], command: string) {
  let url;
  if (hashes.length === 1) {
    url = new URL(
      THIRDWEB_URL +
        `/contracts/${command}/` +
        encodeURIComponent(hashes[0].replace("ipfs://", "")),
    );
  } else {
    url = new URL(THIRDWEB_URL + "/contracts/" + command);
    for (let hash of hashes) {
      url.searchParams.append("ipfs", hash.replace("ipfs://", ""));
    }
  }
  return url;
}
