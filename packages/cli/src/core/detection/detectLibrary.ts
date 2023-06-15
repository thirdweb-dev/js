import { info } from "../helpers/logger";
import { LibraryType, PackageManagerType } from "../types/ProjectType";
import { LibraryDetector } from "./detector";
import inquirer from "inquirer";
import ReactDetector from "./libraries/react";
import ExpressDetector from "./libraries/express";
import ReactNativeDetector from "./libraries/reactNative";
import ViteDetector from "./libraries/vite";
import Web3PyDetector from "./libraries/web3py";
import PlayMakerDetector from "./libraries/playmaker";

export default async function detect(
  path: string,
  options: any,
  detectedPackageManager: PackageManagerType,
): Promise<LibraryType> {
  // We could optimize further if we want, by only running the detectors that match the package manager.
  const libraryDetectors: LibraryDetector[] = [
    new ExpressDetector(),
    new ReactDetector(),
    new ReactNativeDetector(),
    new ViteDetector(),
    new Web3PyDetector(),
    new PlayMakerDetector(),
  ];

  const possibleLibraries = libraryDetectors
    .filter((detector) => detector.matches(path, detectedPackageManager))
    .map((detector) => detector.libraryType);

  if (!possibleLibraries.length) {
    return "none";
  }

  if (possibleLibraries.length === 1) {
    return possibleLibraries[0];
  }

  if (possibleLibraries.includes("react-native") && possibleLibraries.includes("react")) {
    return "react-native";
  }

  info(
    `Detected multiple possible libraries: ${possibleLibraries
      .map((s) => `"${s}"`)
      .join(", ")}`,
  );

  const question =
    "We detected multiple possible libraries which one do you want to use?";

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
