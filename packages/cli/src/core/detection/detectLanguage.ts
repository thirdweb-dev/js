import { info } from "../helpers/logger";
import { LanguageType } from "../types/ProjectType";
import { LanguageDetector } from "./detector";
import inquirer from "inquirer";
import JavascriptDetector from "./languages/javascript";
import TypescriptDetector from "./languages/typescript";
import PythonDetector from "./languages/python";
import GoDetector from "./languages/go";

export default async function detect(
  path: string,
  options: any,
): Promise<LanguageType> {
  const languageDetectors: LanguageDetector[] = [
    new JavascriptDetector(),
    new TypescriptDetector(),
    new PythonDetector(),
    new GoDetector(),
  ];

  const possibleLanguages = languageDetectors
    .filter((detector) => detector.matches(path))
    .map((detector) => detector.languageType);

  if (!possibleLanguages.length) {
    return "none";
  }

  if (possibleLanguages.length === 1) {
    return possibleLanguages[0];
  }

  if (
    possibleLanguages.includes("typescript") &&
    possibleLanguages.includes("javascript")
  ) {
    return "typescript";
  }

  info(
    `Detected multiple possible languages: ${possibleLanguages
      .map((s) => `"${s}"`)
      .join(", ")}`,
  );

  const question =
    "We detected multiple possible languages which one do you want to use?";

  if (options.ci) {
    return possibleLanguages[0];
  } else {
    const answer = await inquirer.prompt({
      type: "list",
      choices: possibleLanguages,
      name: question,
    });
    return answer[question];
  }
}
