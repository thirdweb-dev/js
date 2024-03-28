import { hasBaseContract, readBaseContract } from "./base-contracts";
import { DownloadError } from "./create-app";
import { readExtensionBoilerPlate } from "./extension-contract-boilerplate";
import { PackageManager } from "./get-pkg-manager";
import { tryGitInit } from "./git";
import { hasForge } from "./has-forge";
import { install } from "./install";
import { isFolderEmpty } from "./is-folder-empty";
import { getOnline } from "./is-online";
import { isWriteable } from "./is-writeable";
import { makeDir } from "./make-dir";
import { submodules } from "./submodules";
import { downloadAndExtractRepo } from "./templates";
import retry from "async-retry";
import chalk from "chalk";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";

interface ICreateContractProject {
  contractPath: string;
  packageManager: PackageManager;
  contractName: string;
  framework?: string;
  baseContract?: string;
  onlyContract: boolean;
  createExtension: boolean;
}

function isErrorLike(err: unknown): err is { message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    typeof (err as { message?: unknown }).message === "string"
  );
}

export async function createContractProject({
  contractPath,
  packageManager,
  framework,
  contractName,
  baseContract,
  onlyContract,
  createExtension,
}: ICreateContractProject) {
  // Check that the selected base contract is valid
  if (baseContract) {
    const found = hasBaseContract(baseContract);

    if (!found) {
      console.error(
        `Could not locate the base contract for ${chalk.red(
          `"${baseContract}"`,
        )}. Please check that the base contract exists and try again.`,
      );
      process.exit(1);
    }
  }

  // Check that we have write permission for the specified directory
  const root = path.resolve(contractPath);
  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      "The application path is not writable, please check folder permissions and try again.",
    );
    console.error(
      "It is likely you do not have write permissions for this folder.",
    );
    process.exit(1);
  }

  // Check that the contract name is valid
  if (!/(^[a-z0-9A-Z]+$)|(^[a-z0-9A-Z]+\.sol$)/.test(contractName)) {
    console.error(
      `Contract name ${chalk.red(
        `"${contractName}"`,
      )} is not valid (only alphanumeric characters are allowed).`,
    );
    process.exit(1);
  }

  // Clean the contract name
  const contractObjectName = contractName.replace(/\.sol$/, "");
  contractName = contractObjectName + ".sol";

  const useYarn = packageManager === "yarn";

  if (onlyContract) {
    // If we are already in a contracts project, just create a new contract
    if (fs.existsSync(path.join(root, contractName))) {
      console.error(
        `A contract with the name ${chalk.red(
          `"${contractName}"`,
        )} already exists in specified directory.`,
      );
      process.exit(1);
    }

    if (baseContract && baseContract.length > 0) {
      const baseContractText = readBaseContract(baseContract);

      // Set the contents of the Contract.sol file to the base contract
      let contractFile = "";
      contractFile = path.join(root, contractName);

      // Write the base contract to the MyContract.sol file
      await writeFile(contractFile, baseContractText);

      console.log(
        `${chalk.green("Success!")} Created ${contractName} at ${contractPath}`,
      );
    }

    if (!baseContract && createExtension) {
      const extensionBoilerplate = readExtensionBoilerPlate(contractObjectName);

      // Set the contents of the Contract.sol file to the extension contract storage library boilerplate
      let contractFile = "";
      contractFile = path.join(root, contractName);

      // Write the extension storage library to the MyContract.sol file
      await writeFile(contractFile, extensionBoilerplate);

      console.log(
        `${chalk.green(
          "Success!",
        )} Created your ${contractName} extension at ${contractPath}`,
      );
    }
  } else {
    // Otherwise, create a new contracts project
    const projectName = path.basename(root);

    await makeDir(root);
    if (!isFolderEmpty(root, projectName)) {
      process.exit(1);
    }

    const isOnline = !useYarn || (await getOnline());
    const originalDirectory = process.cwd();

    console.log(
      `Creating a new thirdweb contracts project in ${chalk.green(root)}.`,
    );
    console.log();

    process.chdir(root);

    try {
      console.log(`Downloading files. This might take a moment.`);

      let starter = "";
      if (framework === "hardhat") {
        starter = "hardhat-javascript-starter";
      } else if (framework === "forge") {
        starter = "forge-starter";
      } else {
        console.error("Please provide a valid contracts framework.");
        process.exit(1);
      }

      await retry(
        () => downloadAndExtractRepo(root, { name: starter, filePath: "" }),
        {
          retries: 3,
        },
      );

      // Add in a new contracts file with specific base contract
      if (baseContract && baseContract.length > 0) {
        const baseContractText = readBaseContract(baseContract).replace(
          "contract Contract",
          `contract ${contractName.replace(".sol", "")}`,
        );

        // Set the filename of the new file and delete the dummy Contract.sol file
        let contractFile = "";
        if (framework === "hardhat") {
          fs.unlinkSync(path.join(root, "contracts", "Contract.sol"));
          contractFile = path.join(root, "contracts", contractName);
        }
        if (framework === "forge") {
          fs.unlinkSync(path.join(root, "src", "Contract.sol"));
          contractFile = path.join(root, "src", contractName);
        }

        // Write the base contract to the new file
        await writeFile(contractFile, baseContractText);
      }

      if (!baseContract && createExtension) {
        const extensionBoilerplate =
          readExtensionBoilerPlate(contractObjectName);

        // Set the contents of the Contract.sol file to the extension contract storage library boilerplate
        let contractFile = "";
        contractFile = path.join(root, contractName);
        if (framework === "hardhat") {
          fs.unlinkSync(path.join(root, "contracts", "Contract.sol"));
          contractFile = path.join(root, "contracts", contractName);
        }
        if (framework === "forge") {
          fs.unlinkSync(path.join(root, "src", "Contract.sol"));
          contractFile = path.join(root, "src", contractName);
        }

        // Write the extension storage library to the MyContract.sol file
        await writeFile(contractFile, extensionBoilerplate);
      }
    } catch (reason) {
      throw new DownloadError(
        isErrorLike(reason) ? reason.message : String(reason),
      );
    }

    console.log("Installing packages. This might take a couple of minutes.");
    console.log();

    await install(root, null, { packageManager, isOnline });
    console.log();

    if (tryGitInit(root)) {
      console.log("Initialized a git repository.");
      console.log();
    }

    if (framework === "forge") {
      await submodules();
    }

    let cdpath: string;
    if (path.join(originalDirectory, projectName) === contractPath) {
      cdpath = projectName;
    } else {
      cdpath = contractPath;
    }

    console.log(
      `${chalk.green("Success!")} Created ${projectName} at ${contractPath}`,
    );
    console.log();
    console.log("Inside that directory, you can run several commands:");
    console.log();
    console.log(
      chalk.cyan(`  ${packageManager}${useYarn ? "" : " run"} build`),
    );
    console.log(
      "    Compiles your contracts and detects thirdweb extensions implemented on them.",
    );
    console.log();
    console.log(
      chalk.cyan(`  ${packageManager}${useYarn ? "" : " run"} deploy`),
    );
    console.log("    Deploys your contracts with the thirdweb deploy flow.");
    console.log();
    console.log(
      chalk.cyan(`  ${packageManager}${useYarn ? "" : " run"} publish`),
    );
    console.log("    Publishes your contracts with the thirdweb publish flow.");
    console.log();
    console.log("We suggest that you begin by typing:");
    console.log();
    console.log(chalk.cyan("  cd"), cdpath);
    console.log();

    if (framework === "forge") {
      const isInstalled = await hasForge();

      if (!isInstalled) {
        console.log(
          `\n${chalk.yellowBright(
            `warning`,
          )} You don't have forge installed on this machine, and will need it to run this project! \n\nYou can install forge by following these instructions:\n${chalk.blueBright(
            `https://book.getfoundry.sh/getting-started/installation`,
          )}\n`,
        );
      }
    }
  }
}
