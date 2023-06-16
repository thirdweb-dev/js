import { AppType, ContractLibrariesType, FrameworkType, LanguageType, LibraryType, PackageManagerType } from "../core/types/ProjectType";
import { runCommand } from "../create/helpers/run-command";

type DetectionsType = {
  detectedPackageManager: PackageManagerType;
  detectedLanguage: LanguageType;
  detectedLibrary: LibraryType;
  detectedFramework: FrameworkType;
  detectedAppType: AppType;
  detectedContractLibrary: ContractLibrariesType;
}

export const runBuild = async (detections: DetectionsType, options: any) => {
  const { detectedPackageManager, detectedFramework } = detections;
  let runner: string = "";
  let command: string[] = [];

  switch (detectedPackageManager) {
    case "npm":
    case "yarn":
    case "pnpm":
      const { runner: jsRunner, command: jsCommand } = getJsBuildCommand(detectedFramework, detectedPackageManager);
      if (jsRunner === "" || jsCommand.length === 0) {
        throw new Error(`'${detectedFramework}' projects are not supported for this command.`);
      }
      runner = jsRunner;
      command = jsCommand;
      break;
    case "pip":
    case "pipenv":
    case "poetry":
      throw new Error(`'${detectedPackageManager}' projects are not supported for this command.`);
    case "go-modules":
      const { runner: goRunner, command: goCommand } = getGoBuildCommand(detectedFramework, options.path);
      runner = goRunner;
      command = goCommand;
      break;
    default:
      throw new Error(`'${detectedPackageManager}' projects are not supported for this command.`);
  }

  try {
    await runCommand(runner, command, options.debug);
  } catch (error) {
    throw new Error("Project failed to build! Try running `thirdweb build -d` to see a more detailed error");
  }
};

const getJsBuildCommand = (detectedFramework: FrameworkType, detectedPackageManager: PackageManagerType) => {
  const prefix = detectedPackageManager === "yarn" ? "" : "run";
  let finalCommand: {
    runner: string;
    command: string[];
  } = {
    runner: "",
    command: [],
  };

  switch (detectedFramework) {
    case "next":
      finalCommand.runner = detectedPackageManager;
      finalCommand.command = ["build"];
      break;
    case "gatsby":
      finalCommand.runner = detectedPackageManager;
      finalCommand.command = ["build"];
      break;
    case "remix":
      finalCommand.runner = detectedPackageManager;
      finalCommand.command = ["build"];
      break;
    case "cra":
      finalCommand.runner = detectedPackageManager;
      finalCommand.command = ["build"];
      break;
    case "vue":
      finalCommand.runner = detectedPackageManager;
      finalCommand.command = ["build"];
      break;
    case "expo":
      break;
    case "react-native-cli":
      break;
    case "express":
      finalCommand.runner = detectedPackageManager;
      finalCommand.command = ["build"];
      break;
    case "fastify":
      finalCommand.runner = detectedPackageManager;
      finalCommand.command = ["build"];
      break;
    default:
      break;
    }
    if (prefix) {
      finalCommand.command.unshift(prefix);
    }
    return finalCommand;
};

const getGoBuildCommand = (detectedFramework: FrameworkType, projectPath: string) => {
  let finalCommand: {
    runner: string;
    command: string[];
  } = {
    runner: "",
    command: [],
  };

  switch (detectedFramework) {
    case "gin":
      finalCommand.runner = "go";
      finalCommand.command = ["build", projectPath];
      break;
    case "echo":
      finalCommand.runner = "go";
      finalCommand.command = ["build", projectPath];
      break;
    case "revel":
      finalCommand.runner = "revel";
      finalCommand.command = ["build", "-a", projectPath];
      break;
    case "fiber":
      finalCommand.runner = "go";
      finalCommand.command = ["build", projectPath];
      break;
    default:
      break;
  }
  return finalCommand;
};