// Import required dependencies
import { existsSync, readFileSync } from "fs";
import ora from "ora";
import inquirer from "inquirer";

// Import project dependencies
import detectFramework from "../core/detection/detectFramework";
import detectPackageManager from "../core/detection/detectPackageManager";
import detectLibrary from "../core/detection/detectLibrary";
import {
  ContractLibrariesType,
  contractLibraries,
} from "../core/types/ProjectType";
import {
  checkIfBrowniePackageIsInstalled,
  getDependenciesForFoundry,
  getDependenciesForGo,
  getDependenciesForPython,
  installOrUpdate,
  parsePackageJson,
  processAppType,
  processContractAppType,
} from "../lib/utils";
import { logger } from "../core/helpers/logger";

// Define excluded dependencies
const EXCLUDED_DEPENDENCIES = ["@thirdweb-dev/chain-icons"];

export async function install(projectPath = ".", options: any) {
  const debug = options.debug || false;
  let installer;
  let updater;

  // Initialize all dependencies.
  let jsDependencies: { [key: string]: string } | string[] = {};
  let jsDevDependencies: { [key: string]: string } | string[] = {};
  let pythonDependencies: string[] = [];
  let pythonDevDependencies: string[] = [];
  let peerDependencies: { [key: string]: string } = {};
  let goDependencies: { name: string; version: string }[] = [];
  const thirdwebDepsToInstall = new Set<string>();
  const otherDeps = new Set<string>();

  // Initialize brownie and foundry checks
  let thirdwebExistsInBrownie = { package: "", exists: false };
  let thirdwebExistsInFoundry = false;

  // Detect the package manager, and framework used in the project
  const detectedPackageManager = await detectPackageManager(
    projectPath,
    options,
  );
  const detectedFramework = await detectFramework(
    projectPath,
    options,
    detectedPackageManager,
  );
  const detectedLibrary = await detectLibrary(
    projectPath,
    options,
    detectedPackageManager,
  );

  // Determine project type
  const detectedAppType =
    detectedFramework !== "none"
      ? contractLibraries.includes(detectedFramework as ContractLibrariesType)
        ? "contract"
        : "app"
      : "app";

  // Identify which specific package manager is used
  const isBrowniePackageManager = detectedPackageManager === "brownie";
  const isFoundryPackageManager = detectedPackageManager === "foundry";
  const isGoPackageManager = detectedPackageManager === "go-modules";
  const isPythonPackageManager = ["pip", "pipenv", "poetry"].includes(
    detectedPackageManager,
  );
  const isJSPackageManager = ["yarn", "pnpm", "npm"].includes(
    detectedPackageManager,
  );

  // Processing JS/TS dependencies
  if (isJSPackageManager) {
    const packageJsonPath = projectPath + "/package.json";

    // Check if package.json exists
    if (!existsSync(packageJsonPath)) {
      console.error(
        "No package.json file found. Please run this command in the root of your project.",
      );
      return;
    }

    // Parse package.json
    const packageJson = readFileSync(packageJsonPath);
    const parsedJSDeps = parsePackageJson(packageJson);
    jsDependencies = parsedJSDeps.dependencies;
    jsDevDependencies = parsedJSDeps.devDependencies;
    peerDependencies = parsedJSDeps.peerDependencies;
  }

  // Processing Python dependencies
  if (isPythonPackageManager) {
    const pythonDeps = getDependenciesForPython(
      projectPath,
      detectedPackageManager,
    );
    pythonDependencies = pythonDeps.dependencies;
    pythonDevDependencies = pythonDeps.devDependencies;
  }

  // Processing Brownie dependencies
  if (isBrowniePackageManager) {
    const regex = /\s*thirdweb-dev\/contracts@\d+\.\d+\.\d+/g;
    const res = await checkIfBrowniePackageIsInstalled(regex);
    thirdwebExistsInBrownie = res;
  }

  // Processing Foundry dependencies
  if (isFoundryPackageManager) {
    const exists = await getDependenciesForFoundry(
      projectPath,
      "thirdweb-contracts",
    );
    thirdwebExistsInFoundry = exists;
  }

  // Processing Go dependencies
  if (isGoPackageManager) {
    const deps = getDependenciesForGo(projectPath);
    goDependencies = deps;
  }

  const hasEthers = !!jsDependencies?.ethers || !!jsDevDependencies?.ethers;

  const version = !isJSPackageManager
    ? ""
    : options.dev
    ? "@dev"
    : options.nightly
    ? "@nightly"
    : "";

  const thirdwebDepsToUpdate = new Set<string>(
    [
      ...Object.keys(jsDependencies).filter((dep) =>
        dep.startsWith("@thirdweb-dev/"),
      ),
      ...Object.keys(jsDevDependencies).filter((dep) =>
        dep.startsWith("@thirdweb-dev/"),
      ),
      ...Object.keys(peerDependencies).filter((dep) =>
        dep.startsWith("@thirdweb-dev/"),
      ),
      ...pythonDependencies
        .filter((dep) => dep.startsWith("thirdweb-sdk"))
        .map((dep) => dep.split("==")[0]),
      ...pythonDevDependencies
        .filter((dep) => dep.startsWith("thirdweb-sdk"))
        .map((dep) => dep.split("==")[0]),
      ...goDependencies
        .filter((dep) => {
          console.log("dep", dep);
          return dep.name === "github.com/thirdweb-dev/go-sdk/v2";
        })
        .map((dep) => dep.name),
    ]
      .concat(
        thirdwebExistsInBrownie.exists ? [thirdwebExistsInBrownie.package] : [],
      )
      .concat(thirdwebExistsInFoundry ? ["lib/thirdweb-contracts"] : []),
  );

  // Figure out which dependencies to install and which to update.
  if (detectedAppType === "contract") {
    processContractAppType({
      detectedPackageManager,
      thirdwebDepsToUpdate,
      thirdwebDepsToInstall,
      isJSPackageManager,
    });
  } else if (detectedAppType === "app") {
    processAppType({
      detectedLibrary,
      detectedFramework,
      hasEthers,
      isGoPackageManager,
      isJSPackageManager,
      isPythonPackageManager,
      otherDeps,
      thirdwebDepsToInstall,
      thirdwebDepsToUpdate,
    });
  }

  // remove exluded dependencies
  EXCLUDED_DEPENDENCIES.forEach((excludedDep) => {
    thirdwebDepsToUpdate.delete(excludedDep);
    thirdwebDepsToInstall.delete(excludedDep);
  });

  // Ask which dependencies to install
  if (thirdwebDepsToInstall.size !== 0) {
    const answer = await inquirer.prompt({
      type: "checkbox",
      choices: [...thirdwebDepsToInstall],
      message: "Which thirdweb dependencies would you like to install?",
      name: "dependencies",
      default: [...thirdwebDepsToInstall],
    });

    if (answer.dependencies.length !== thirdwebDepsToInstall.size) {
      thirdwebDepsToInstall.clear();
      answer.dependencies.forEach((dep: string) =>
        thirdwebDepsToInstall.add(dep),
      );
    }
  }

  // Ask which dependencies to update
  if (thirdwebDepsToUpdate.size !== 0) {
    const answer = await inquirer.prompt({
      type: "checkbox",
      choices: [...thirdwebDepsToUpdate],
      message: "Which thirdweb dependencies would you like to update?",
      name: "dependencies",
      default: [...thirdwebDepsToUpdate],
    });

    if (answer.dependencies.length !== thirdwebDepsToUpdate.size) {
      thirdwebDepsToUpdate.clear();
      answer.dependencies.forEach((dep: string) =>
        thirdwebDepsToUpdate.add(dep),
      );
    }
  }

  if (thirdwebDepsToInstall.size === 0 && thirdwebDepsToUpdate.size === 0) {
    console.log("No thirdweb dependencies to install or update.");
    return;
  }

  if (debug) {
    logger.info("Detected package manager: " + detectedPackageManager);
    logger.info("Detected library: " + detectedLibrary);
    logger.info("Detected framework: " + detectedFramework);
    logger.info("Detected app type: " + detectedAppType);
  }

  try {
    const dependenciesToAdd = [
      ...[...thirdwebDepsToInstall].map((dep) => `${dep}${version}`),
      ...otherDeps,
    ];

    const dependenciesToUpdate = [...thirdwebDepsToUpdate].map(
      (dep) => `${dep}${version}`,
    );

    if (thirdwebDepsToInstall.size !== 0) {
      installer = ora(
        `Installing: "${[...thirdwebDepsToInstall].join('", "')}"`,
      ).start();
      await installOrUpdate(
        detectedPackageManager,
        dependenciesToAdd,
        [],
        "install",
        { oldVersion: thirdwebExistsInBrownie.package, debug },
      );
      installer?.succeed(`Installed: "${dependenciesToAdd.join('", "')}"`);
    }

    if (thirdwebDepsToUpdate.size !== 0) {
      updater = ora(
        `Updating: "${[...thirdwebDepsToUpdate].join('", "')}"`,
      ).start();
      await installOrUpdate(
        detectedPackageManager,
        [],
        dependenciesToUpdate,
        "update",
        {
          debug,
        },
      );
      updater?.succeed(`Updated: "${dependenciesToUpdate.join('", "')}"`);
    }
  } catch (err) {
    console.error("Can't install within project: ", err);
    return Promise.reject("Can't install within project");
  }
}
