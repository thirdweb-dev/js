import BrownieDetector from "../core/detection/brownie";
import CRADetector from "../core/detection/cra";
import FoundryDetector from "../core/detection/foundry";
import HardhatDetector from "../core/detection/hardhat";
import NextDetector from "../core/detection/next";
import NPMDetector from "../core/detection/npm";
import SolcDetector from "../core/detection/solc";
import TruffleDetector from "../core/detection/truffle";
import ViteDetector from "../core/detection/vite";
import YarnDetector from "../core/detection/yarn";
import { runCommand } from "../create/helpers/run-command";
import fs from "fs";
import ora from "ora";
import { info } from "../core/helpers/logger";

const EXCLUDED_DEPENDENCIES = ["@thirdweb-dev/chain-icons"];

export async function install(projectPath = ".", options: any) {
  const supportedContractFrameworks = [
    new BrownieDetector(),
    new FoundryDetector(),
    new HardhatDetector(),
    new TruffleDetector(),
    new SolcDetector(),
  ].filter((detector) => detector.matches(projectPath));

  const supportedAppFrameworks = [
    new ViteDetector(),
    new NextDetector(),
    new CRADetector(),
  ].filter((detector) => detector.matches(projectPath));

  const hasYarn = new YarnDetector().matches(".");
  const hasNPM = new NPMDetector().matches(".");

  let packageJson;
  try {
    packageJson = JSON.parse(
      fs.readFileSync(projectPath + "/package.json", "utf8"),
    );
  } catch (e) {
    console.error(
      "No package.json file found. Please run this command in the root of your project.",
    );
    return;
  }

  const hasEthers =
    !!packageJson?.dependencies?.ethers ||
    !!packageJson?.devDependencies?.ethers;

  const version = options.dev
    ? "@dev"
    : options.nightly
    ? "@nightly"
    : "@latest";

  if (
    supportedAppFrameworks.length === 0 &&
    supportedContractFrameworks.length === 0
  ) {
    throw new Error("No supported project detected");
  }

  const thirdwebDepsToUpdate = new Set<string>([
    ...Object.keys(packageJson.dependencies || {}).filter((dep) =>
      dep.startsWith("@thirdweb-dev/"),
    ),
    ...Object.keys(packageJson.devDependencies || {}).filter((dep) =>
      dep.startsWith("@thirdweb-dev/"),
    ),
    ...Object.keys(packageJson.peerDependencies || {}).filter((dep) =>
      dep.startsWith("@thirdweb-dev/"),
    ),
  ]);

  const thirdwebDepsToInstall = new Set<string>();

  const otherDeps = new Set<string>();

  // only expect one contract framework to be detected
  const contractFramework = supportedContractFrameworks[0];
  // only expect one app framework to be detected
  const appFramerwork = supportedAppFrameworks[0];

  if (contractFramework) {
    info(`Detected project: "${contractFramework.projectType}"`);

    if (!thirdwebDepsToUpdate.has(`@thirdweb-dev/contracts`)) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/contracts`);
    }
  } else if (appFramerwork) {
    info(`Detected project: "${appFramerwork.projectType}"`);

    if (!thirdwebDepsToUpdate.has(`@thirdweb-dev/react`)) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/react`);
    }
    if (!thirdwebDepsToUpdate.has(`@thirdweb-dev/sdk`)) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/sdk`);
    }
    if (!hasEthers) {
      otherDeps.add("ethers@5");
    }
  }

  // remove exluded dependencies
  EXCLUDED_DEPENDENCIES.forEach((excludedDep) => {
    thirdwebDepsToUpdate.delete(excludedDep);
    thirdwebDepsToInstall.delete(excludedDep);
  });

  let installer;
  let updater;

  try {
    if (thirdwebDepsToInstall.size !== 0) {
      installer = ora(
        `Installing: "${[...thirdwebDepsToInstall].join('", "')}"`,
      ).start();
    }
    if (thirdwebDepsToUpdate.size !== 0) {
      updater = ora(
        `Updating: "${[...thirdwebDepsToUpdate].join('", "')}"`,
      ).start();
    }

    const dependenciesToAdd = [
      ...[...thirdwebDepsToInstall].map((dep) => `${dep}${version}`),
      ...otherDeps,
    ];

    const dependenciesToUpdate = [...thirdwebDepsToUpdate].map(
      (dep) => `${dep}${version}`,
    );

    if (hasYarn) {
      if (dependenciesToAdd.length !== 0) {
        await runCommand("yarn", ["add", ...dependenciesToAdd]);
        installer?.succeed(`Installed: "${dependenciesToAdd.join('", "')}"`);
      }
      if (dependenciesToUpdate.length !== 0) {
        await runCommand("yarn", ["upgrade", ...dependenciesToUpdate]);
        updater?.succeed(`Updated: "${dependenciesToUpdate.join('", "')}"`);
      }
    } else if (hasNPM) {
      if (dependenciesToAdd.length !== 0) {
        await runCommand("npm", ["install", ...dependenciesToAdd]);
        installer?.succeed(`Installed: "${dependenciesToAdd.join('", "')}"`);
      }
      if (dependenciesToUpdate.length !== 0) {
        await runCommand("npm", ["update", ...dependenciesToUpdate]);
        updater?.succeed(`Updated: "${dependenciesToUpdate.join('", "')}"`);
      }
    }
  } catch (err) {
    console.error("Can't install within project");
    return Promise.reject("Can't install within project");
  }
}
