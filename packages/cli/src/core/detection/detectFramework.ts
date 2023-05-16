import { info } from "../helpers/logger";
import { FrameworkType, PackageManagerType } from "../types/ProjectType";
import inquirer from "inquirer";
import NextDetector from "./frameworks/next";
import CRADetector from "./frameworks/cra";
import RemixDetector from "./frameworks/remix";
import GatsbyDetector from "./frameworks/gatsby";
import VueDetector from "./frameworks/vue";
import ReactNativeCLIDetector from "./frameworks/reactNativeCli";
import DjangoDetector from "./frameworks/django";
import ExpoDetector from "./frameworks/expo";
import FoundryDetector from "./frameworks/foundry";
import HardhatDetector from "./frameworks/hardhat";
import { FrameworkDetector } from "./detector";
import TruffleDetector from "./frameworks/truffle";
import BrownieDetector from "./frameworks/brownie";
import FastAPIDetector from "./frameworks/fastAPI";
import FlaskDetector from "./frameworks/flask";
import PopulusDetector from "./frameworks/populus";
import FastifyDetector from "./frameworks/fastify";
import EchoDetector from "./frameworks/echo";
import FiberDetector from "./frameworks/fiber";
import GinDetector from "./frameworks/gin";
import RevelDetector from "./frameworks/revel";
import ZenjectDetector from "./frameworks/zenject";

export default async function detect(
  path: string,
  options: any,
  detectedPackageManager: PackageManagerType,
): Promise<FrameworkType> {
  // We could optimize further if we want, by only running the detectors that match the package manager.
  const frameworkDetectors: FrameworkDetector[] = [
    new BrownieDetector(),
    new CRADetector(),
    new DjangoDetector(),
    new EchoDetector(),
    new ExpoDetector(),
    new FastAPIDetector(),
    new FastifyDetector(),
    new FiberDetector(),
    new FlaskDetector(),
    new FoundryDetector(),
    new GatsbyDetector(),
    new GinDetector(),
    new HardhatDetector(),
    new NextDetector(),
    new PopulusDetector(),
    new ReactNativeCLIDetector(),
    new RemixDetector(),
    new RevelDetector(),
    new TruffleDetector(),
    new VueDetector(),
    new ZenjectDetector(),
  ];

  const possibleFrameworks = frameworkDetectors
    .filter((detector) => detector.matches(path, detectedPackageManager))
    .map((detector) => detector.frameworkType);

  if (!possibleFrameworks.length) {
    return "none";
  }

  if (possibleFrameworks.length === 1) {
    return possibleFrameworks[0];
  }

  info(
    `Detected multiple possible frameworks: ${possibleFrameworks
      .map((s) => `"${s}"`)
      .join(", ")}`,
  );

  const question =
    "We detected multiple possible frameworks which one do you want to use?";

  if (options.ci) {
    return possibleFrameworks[0];
  } else {
    const answer = await inquirer.prompt({
      type: "list",
      choices: possibleFrameworks,
      name: question,
    });
    return answer[question];
  }
}
