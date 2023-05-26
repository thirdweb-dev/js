// Import required dependencies
import { existsSync, readFileSync } from "fs";
import ora from "ora";

// Import project dependencies
import detectFramework from "../core/detection/detectFramework";
import detectPackageManager from "../core/detection/detectPackageManager";
import detectLibrary from "../core/detection/detectLibrary";
import { info } from "../core/helpers/logger";
import { ContractLibrariesType, contractLibraries } from "../core/types/ProjectType";
import { checkIfBrowniePackageIsInstalled, getDependenciesForFoundry, getDependenciesForGo, getDependenciesForPython, getLatestVersion, installOrUpdate, parsePackageJson, processAppType, processContractAppType } from "../lib/utils";

// Define excluded dependencies
const EXCLUDED_DEPENDENCIES = ["@thirdweb-dev/chain-icons"];

export async function installV2(projectPath = ".", options: any) {
  let jsDependencies: { [key: string]: string } | string[] = {};
  let pythonDependencies: string[] = [];
  let jsDevDependencies: { [key: string]: string } | string[] = {};
  let pythonDevDependencies: string[] = [];
  let peerDependencies: { [key: string]: string } = {};
  let goDependencies: { name: string; version: string }[] = [];

  // Initialize brownie and foundry checks
  let thirdwebExistsInBrownie = { package: "", exists: false };
  let thirdwebExistsInFoundry = false;

  // Detect the package manager, framework, and library used in the project
  const detectedPackageManager = await detectPackageManager(projectPath, options);
  const detectedFramework = await detectFramework(projectPath, options, detectedPackageManager);
  const detectedLibrary = await detectLibrary(projectPath, options, detectedPackageManager);

  // Determine project type
  const detectedAppType = detectedFramework !== "none" ? contractLibraries.includes(detectedFramework as ContractLibrariesType) ? "contract" : "app" : "app";

  // Identify if a specific package manager is used
  const isBrowniePackageManager = detectedPackageManager === "brownie";
  const isFoundryPackageManager = detectedPackageManager === "foundry";
  const isGoPackageManager = detectedPackageManager === "go-modules";
  const isPythonPackageManager = ["pip", "pipenv", "poetry"].includes(detectedPackageManager);
  const isJSPackageManager = ["yarn", "pnpm", "npm"].includes(detectedPackageManager);

  // Log the detected items
  info(`Detected package manager: "${detectedPackageManager}"`);
  info(`Detected framework: "${detectedFramework}"`);
  info(`Detected library: "${detectedLibrary}"`);
  info(`Detected project type: "${detectedAppType}"`);

  // Processing JS/TS dependencies
  if (isJSPackageManager) {
    let packageJson;
    const packageJsonPath = projectPath + "/package.json";

    // Check if package.json exists
    if (!existsSync(packageJsonPath)) {
      console.error(
        "No package.json file found. Please run this command in the root of your project."
      );
      return;
    }

    // Parse package.json
    packageJson = readFileSync(packageJsonPath);
    const parsedJSDeps = parsePackageJson(packageJson);
    jsDependencies = parsedJSDeps.dependencies;
    jsDevDependencies = parsedJSDeps.devDependencies;
    peerDependencies = parsedJSDeps.peerDependencies;
  }

  // Processing Python dependencies
  if (isPythonPackageManager) {
    const pythonDeps = getDependenciesForPython(projectPath, detectedPackageManager);
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
    const exists = await getDependenciesForFoundry(projectPath, "thirdweb-contracts");
    thirdwebExistsInFoundry = exists;
  }

  // Processing Go dependencies
  if (isGoPackageManager) {
    const deps = getDependenciesForGo(projectPath);
    goDependencies = deps;
  }

  const hasEthers =
    !!jsDependencies?.ethers ||
    !!jsDevDependencies?.ethers;

  const version = !isJSPackageManager ? "" :
    options.dev
      ? "@dev"
      : options.nightly
        ? "@nightly" : "";

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
        .map((dep) => dep.split('==')[0]),
      ...pythonDevDependencies
        .filter((dep) => dep.startsWith("thirdweb-sdk"))
        .map((dep) => dep.split('==')[0]),
      ...goDependencies
        .filter((dep) => {
          console.log('dep', dep)
          return dep.name === "github.com/thirdweb-dev/go-sdk/v2"
        })
        .map((dep) => dep.name),
    ].concat(thirdwebExistsInBrownie.exists ? [thirdwebExistsInBrownie.package] : [])
      .concat(thirdwebExistsInFoundry ? ["lib/thirdweb-contracts"] : [])
  );

  const thirdwebDepsToInstall = new Set<string>();
  const otherDeps = new Set<string>();

  if (detectedAppType === "contract") {
    processContractAppType({ detectedPackageManager, thirdwebDepsToUpdate, thirdwebDepsToInstall, isJSPackageManager })
  } else if (detectedAppType === "app") {
    processAppType({
      detectedFramework,
      hasEthers,
      isGoPackageManager,
      isJSPackageManager,
      isPythonPackageManager,
      otherDeps,
      thirdwebDepsToInstall,
      thirdwebDepsToUpdate
    })
  }

  // remove exluded dependencies
  EXCLUDED_DEPENDENCIES.forEach((excludedDep) => {
    thirdwebDepsToUpdate.delete(excludedDep);
    thirdwebDepsToInstall.delete(excludedDep);
  });

  let installer;
  let updater;

  try {
    const dependenciesToAdd = [
      ...[...thirdwebDepsToInstall].map((dep) => `${dep}${version}`),
      ...otherDeps,
    ];

    const dependenciesToUpdate = [...thirdwebDepsToUpdate].map(
      (dep) => `${dep}${version}`,
    )

    if (thirdwebDepsToInstall.size !== 0) {
      installer = ora(
        `Installing: "${[...thirdwebDepsToInstall].join('", "')}"`,
      ).start();
      await installOrUpdate(detectedPackageManager, dependenciesToAdd, [], "install", { oldVersion: thirdwebExistsInBrownie.package });
      installer?.succeed(`Installed: "${dependenciesToAdd.join('", "')}"`);
    }

    if (thirdwebDepsToUpdate.size !== 0) {
      updater = ora(
        `Updating: "${[...thirdwebDepsToUpdate].join('", "')}"`,
      ).start();
      await installOrUpdate(detectedPackageManager, [], dependenciesToUpdate, "update");
      updater?.succeed(`Updated: "${dependenciesToUpdate.join('", "')}"`);
    }


  } catch (err) {
    console.error("Can't install within project");
    return Promise.reject("Can't install within project");
  }
}
