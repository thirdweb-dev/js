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

  const packageJson = JSON.parse(
    fs.readFileSync(projectPath + "/package.json", "utf8"),
  );
  const hasEthers =
    !!packageJson.dependencies?.ethers || !!packageJson.devDependencies?.ethers;

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

  const thirdwebDepsToUpdate = new Set<string>(
    Object.keys(packageJson.dependencies).filter((dep) =>
      dep.startsWith("@thirdweb-dev/"),
    ),
  );

  const thirdwebDepsToInstall = new Set<string>();

  const otherDeps = new Set<string>();

  supportedContractFrameworks.forEach((detector) => {
    console.log(`Detected ${detector.projectType} project`);

    if (!thirdwebDepsToUpdate.has(`@thirdweb-dev/contracts`)) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/contracts`);
    }
  });

  supportedAppFrameworks.forEach((detector) => {
    console.log(`Detected ${detector.projectType} project`);

    if (!thirdwebDepsToUpdate.has(`@thirdweb-dev/react`)) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/react`);
    }
    if (!thirdwebDepsToUpdate.has(`@thirdweb-dev/sdk`)) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/sdk`);
    }
    if (!hasEthers) {
      otherDeps.add("ethers@5");
    }
  });

  try {
    console.log(
      `Updating dependencies: "${[...thirdwebDepsToUpdate].join('", "')}"`,
    );
    console.log(
      `Installing dependencies: "${[...thirdwebDepsToInstall].join('", "')}"`,
    );

    const dependenciesToAdd = [
      ...[...thirdwebDepsToUpdate, ...thirdwebDepsToInstall].map(
        (dep) => `${dep}${version}`,
      ),
      ...otherDeps,
    ];

    if (hasYarn) {
      await runCommand("yarn add", dependenciesToAdd);
    } else if (hasNPM) {
      await runCommand("npm install", dependenciesToAdd);
    }
  } catch (err) {
    console.error("Can't install within project");
    return Promise.reject("Can't install within project");
  }
}
