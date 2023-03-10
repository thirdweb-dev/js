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

  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
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

  const dependenciesToAdd = new Set<string>();

  supportedContractFrameworks.forEach((detector) => {
    console.log(`Detected ${detector.projectType} project`);

    dependenciesToAdd.add(`@thirdweb-dev/contracts${version}`);
  });

  supportedAppFrameworks.forEach((detector) => {
    console.log(`Detected ${detector.projectType} project`);

    dependenciesToAdd.add(`@thirdweb-dev/react${version}`);
    dependenciesToAdd.add(`@thirdweb-dev/sdk${version}`);
    if (!hasEthers) {
      dependenciesToAdd.add("ethers@5");
    }
  });

  try {
    if (hasYarn) {
      await runCommand("yarn add", [...dependenciesToAdd]);
    } else if (hasNPM) {
      await runCommand("npm install", [...dependenciesToAdd]);
    }
  } catch (err) {
    console.error("Can't install within project");
    return Promise.reject("Can't install within project");
  }
}
