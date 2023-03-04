import BrownieDetector from "../core/detection/brownie";
import CRADetector from "../core/detection/cra";
import FoundryDetector from "../core/detection/foundry";
import HardhatDetector from "../core/detection/hardhat";
import NextDetector from "../core/detection/next";
import NPMDetector from "../core/detection/npm";
import TruffleDetector from "../core/detection/truffle";
import ViteDetector from "../core/detection/vite";
import YarnDetector from "../core/detection/yarn";
import { runCommand } from "../create/helpers/run-command";

export async function install(distPath = "dist", projectPath = ".") {
  const supportedContractFrameworks = [
    new BrownieDetector(),
    new FoundryDetector(),
    new HardhatDetector(),
    new TruffleDetector(),
  ].filter((detector) => detector.matches(projectPath));

  const supportedAppFrameworks = [
    new ViteDetector(),
    new NextDetector(),
    new CRADetector(),
  ].filter((detector) => detector.matches(projectPath));

  const hasYarn = new YarnDetector().matches(".");
  const hasNPM = new NPMDetector().matches(".");

  const possibleProjects = [
    ...supportedContractFrameworks,
    ...supportedAppFrameworks,
  ];

  if (possibleProjects.length === 0) {
    throw new Error("No supported project detected");
  }

  const dependencies = new Set<string>();

  supportedContractFrameworks.forEach((detector) => {
    console.log(`Detected ${detector.projectType} project`);

    dependencies.add("@thirdweb-dev/contract");
  });

  supportedAppFrameworks.forEach((detector) => {
    console.log(`Detected ${detector.projectType} project`);

    dependencies.add("@thirdweb-dev/react");
    dependencies.add("@thirdweb-dev/sdk");
    dependencies.add("ethers^5");

    // add new webpack.ProvidePlugin({ process: "process/browser", Buffer: ["buffer", "Buffer"] })
    // if (detector.projectType === "cra") { }

    // add react plugin to vite config.plugins
    // add { global: "globalThis", process.env: { } } to vite config.define
    // if (detector.projectType === "vite") { }
  });

  try {
    if (hasYarn) {
      await runCommand("yarn add", [...dependencies]);
    } else if (hasNPM) {
      await runCommand("npm install", [...dependencies]);
    }
  } catch (err) {
    console.error("Can't build project");
    return Promise.reject("Can't build project");
  }
}
