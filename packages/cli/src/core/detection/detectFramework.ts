import { info } from "../helpers/logger";
import { FrameworkType } from "../types/ProjectType";
import { FrameworkDetector } from "./detector";
import inquirer from "inquirer";
import NextDetector from "./frameworks/next";
import CRADetector from "./frameworks/cra";

export default async function detect(
  path: string,
  options: any,
): Promise<FrameworkType> {

  const frameworkDetectors: FrameworkDetector[] = [
    new NextDetector(),
    new CRADetector(),
  ];

  const possibleFrameworks = frameworkDetectors
    .filter((detector) => detector.matches(path))
    .map((detector) => detector.frameworkType);

  if (!possibleFrameworks.length) {
    return "none";
  }

  if (possibleFrameworks.length === 1) {
    return possibleFrameworks[0];
  }

  info(`Detected multiple possible frameworks: ${possibleFrameworks.map((s) => `"${s}"`).join(", ")}`);

  const question = "We detected multiple possible frameworks. Which one do you want to use?";

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