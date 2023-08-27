import inquirer from "inquirer";
import { info } from "../helpers/logger";
import { FrameworkType, PackageManagerType } from "../types/ProjectType";
import { FrameworkDetector } from "./detector";
import BrownieDetector from "./frameworks/brownie";
import CRADetector from "./frameworks/cra";
import DjangoDetector from "./frameworks/django";
import EchoDetector from "./frameworks/echo";
import ExpoDetector from "./frameworks/expo";
import FastAPIDetector from "./frameworks/fastAPI";
import FastifyDetector from "./frameworks/fastify";
import FiberDetector from "./frameworks/fiber";
import FlaskDetector from "./frameworks/flask";
import FoundryDetector from "./frameworks/foundry";
import GatsbyDetector from "./frameworks/gatsby";
import GinDetector from "./frameworks/gin";
import HardhatDetector from "./frameworks/hardhat";
import NextDetector from "./frameworks/next";
import PopulusDetector from "./frameworks/populus";
import ReactNativeCLIDetector from "./frameworks/reactNativeCli";
import RemixDetector from "./frameworks/remix";
import RevelDetector from "./frameworks/revel";
import TruffleDetector from "./frameworks/truffle";
import ViteDetector from "./frameworks/vite";
import VueDetector from "./frameworks/vue";
import ZenjectDetector from "./frameworks/zenject";

export default async function detect(
  path: string,
  options: any,
  detectedPackageManager: PackageManagerType,
): Promise<FrameworkType> {
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
    new ViteDetector(),
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

  if (
    possibleFrameworks.includes("expo") &&
    possibleFrameworks.includes("react-native-cli")
  ) {
    return "expo";
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
