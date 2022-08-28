import { hasBaseContract, readBaseContract } from "./base-contracts";
import { DownloadError } from "./create-app";
import { PackageManager } from "./get-pkg-manager";
import { tryGitInit } from "./git";
import { install } from "./install";
import { isFolderEmpty } from "./is-folder-empty";
import { getOnline } from "./is-online";
import { isWriteable } from "./is-writeable";
import { makeDir } from "./make-dir";
import { downloadAndExtractRepo, hasTemplate } from "./templates";
import retry from "async-retry";
import chalk from "chalk";
import { writeFile } from "fs/promises";
import path from "path";
import { submodules } from "./submodules";

interface ICreateContract {
  contractPath: string;
  packageManager: PackageManager;
  framework?: string;
  baseContract?: string;
}

export async function createContract({
  contractPath,
  packageManager,
  framework,
  baseContract,
}: ICreateContract) {
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

  const projectName = path.basename(root);

  await makeDir(root);
  if (!isFolderEmpty(root, projectName)) {
    process.exit(1);
  }

  const useYarn = packageManager === "yarn";
  const isOnline = !useYarn || (await getOnline());
  const originalDirectory = process.cwd();

  console.log(
    `Creating a new thirdweb contracts project in ${chalk.green(root)}.`,
  );
  console.log();

  process.chdir(root);

  function isErrorLike(err: unknown): err is { message: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      typeof (err as { message?: unknown }).message === "string"
    );
  }

  try {
    console.log(`Downloading files. This might take a moment.`);

    let starter = "";
    if (framework === "hardhat") {
      starter = "hardhat-javascript-starter";
    } else if (framework === "forge") {
      starter = "forge-starter";
    } else {
      console.error("Please provide a valid contracts framework.");
      process.exit(1)
    }

    await retry(
      () => downloadAndExtractRepo(root, { name: starter, filePath: "" }),
      {
        retries: 3,
      },
    );

    // Modify the /contracts/MyContract.sol contents to match the base contract
    if (baseContract && baseContract.length > 0) {
      const baseContractText = readBaseContract(baseContract);

      // Set the contents of the Contract.sol file to the base contract
      let contractFile = "";
      if (framework === "hardhat") {
        contractFile = path.join(root, "contracts", "Contract.sol");
      }
      if (framework === "forge") {
        contractFile = path.join(root, "src", "Contract.sol");
      }

      // Write the base contract to the MyContract.sol file
      await writeFile(contractFile, baseContractText);
    }
  } catch (reason) {
    throw new DownloadError(isErrorLike(reason) ? reason.message : reason + "");
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
  console.log("Inside that directory, you can run several commands:");
  console.log();
  console.log(chalk.cyan(`  ${packageManager} ${useYarn ? "" : "run"} deploy`));
  console.log("    Deploys your contracts with the thirdweb deploy flow.");
  console.log();
  console.log(
    chalk.cyan(`  ${packageManager} ${useYarn ? "" : "run"} release`),
  );
  console.log("    Releases your contracts with the thirdweb release flow..");
  console.log();
  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(chalk.cyan("  cd"), cdpath);
  console.log();
}
