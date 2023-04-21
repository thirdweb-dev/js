import { info } from "../helpers/logger";
import { LibraryType } from "../types/ProjectType";
import { LibraryDetector } from "./detector";
import inquirer from "inquirer";
import ReactDetector from "./library/react";

export default async function detect(
  path: string,
  options: any,
): Promise<LibraryType> {

  const libraryDetectors: LibraryDetector[] = [
    new ReactDetector(),
  ];

  const possibleLibraries = libraryDetectors
    .filter((detector) => detector.matches(path))
    .map((detector) => detector.libraryType);

  if (!possibleLibraries.length) {
    return "none";
  }

  if (possibleLibraries.length === 1) {
    return possibleLibraries[0];
  }

  info(`Detected multiple possible libraries: ${possibleLibraries.map((s) => `"${s}"`).join(", ")}`);

  const question = "We detected multiple possible libraries. Which one do you want to use?";

  if (options.ci) {
    return possibleLibraries[0];
  } else {
    const answer = await inquirer.prompt({
      type: "list",
      choices: possibleLibraries,
      name: question,
    });
    return answer[question];
  }
}