import * as toml from "@iarna/toml";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { PackageManagerType } from "../core/types/ProjectType";
import { runCommand } from "../create/helpers/run-command";
import { IProcessAppTypeArgs, IProcessContractAppTypeArgs } from "./types";
import crypto from "crypto";

export function generateStateParameter(length: number) {
  return crypto.randomBytes(length).toString("hex");
}

function convertDependenciesToStringFormat(dependenciesObject: object) {
  return Object.entries(dependenciesObject).map(([pkg, versionDetails]) => {
    let version = "";
    if (typeof versionDetails === "string") {
      version = versionDetails;
    } else if (typeof versionDetails === "object") {
      version = versionDetails.version;
    }
    // Replace '^' with nothing as '^' is not a valid version specifier in Python
    version = version.replace("^", "");
    return `${pkg}==${version}`;
  });
}

export const parsePackageJson = (
  packageJson: Buffer,
): {
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
  peerDependencies: {
    [key: string]: string;
  };
} => {
  const packageJsonContent = JSON.parse(packageJson.toString());
  const dependencies = packageJsonContent.dependencies || {};
  const devDependencies = packageJsonContent.devDependencies || {};
  const peerDependencies = packageJsonContent.peerDependencies || {};
  return { dependencies, devDependencies, peerDependencies };
};

const parseRequirementsTxt = (requirementsTxt: Buffer) => {
  const requirementsTxtContent = requirementsTxt.toString();
  const dependencies = requirementsTxtContent.split("\n");
  return { dependencies };
};

const parsePipFile = (PipFile: string) => {
  const pipfile = toml.parse(PipFile);
  const dependencies = (pipfile.packages as string[]) || [];
  const devDependencies = (pipfile["dev-packages"] as string[]) || [];
  return {
    dependencies,
    devDependencies,
  };
};

const parsePyProjectToml = (pyProjectToml: string) => {
  const pyProjectFile = toml.parse(pyProjectToml) as any;
  const dependencies = pyProjectFile["tool"]["poetry"]["dependencies"] || [];
  const devDependencies =
    pyProjectFile["tool"]["poetry"]["dev-dependencies"] || [];

  return {
    dependencies: convertDependenciesToStringFormat(dependencies),
    devDependencies: convertDependenciesToStringFormat(devDependencies),
  };
};

export const parseGoMod = (goModContent: string) => {
  const dependencies: { name: string; version: string }[] = [];
  const lines: string[] = goModContent.split("\n");

  lines.forEach((line) => {
    line = line.trim();

    if (line.startsWith("require (")) {
      let i = lines.indexOf(line) + 1;
      while (i < lines.length && lines[i].trim() !== ")") {
        const dependencyLine = lines[i].trim();
        const [name, version] = dependencyLine.split(" ");
        dependencies.push({ name, version });
        i++;
      }
    }
  });
  return {
    dependencies,
  };
};

export const fileContainsImport = (file: string, importToCheck: string) => {
  const lines = file.split("\n");

  lines.forEach(() => {
    if (lines.includes(importToCheck)) {
      return true;
    }
  });

  return false;
};

export const getDependenciesForPython = (
  filePath: string,
  packageManager: PackageManagerType,
) => {
  let dependencies: string[] = [];
  let devDependencies: string[] = [];

  switch (packageManager) {
    case "pip":
      const foundRequirementsTxt = existsSync(filePath + "/requirements.txt");
      if (!foundRequirementsTxt) {
        // Create a temporary requirements.txt file
        // runCommand("pip", ["freeze"], true, undefined, "requirements.txt");
        break;
      }
      const requirementsTxt = readFileSync(filePath + "/requirements.txt");
      dependencies = parseRequirementsTxt(requirementsTxt).dependencies;
      // Delete file now that we're done with it
      // runCommand("rm", ["requirements.txt"], true);
      break;
    case "pipenv":
      const foundPipFile = existsSync(filePath + "Pipfile");
      if (!foundPipFile) {
        break;
      }
      const pipFile = readFileSync(filePath + "Pipfile", "utf-8");
      const parsedPipFile = parsePipFile(pipFile);
      dependencies = parsedPipFile.dependencies;
      devDependencies = parsedPipFile.devDependencies;
      break;
    case "poetry":
      const foundPyProjectToml = existsSync(filePath + "/pyproject.toml");
      if (!foundPyProjectToml) {
        break;
      }
      const pyProjectFile = readFileSync(filePath + "/pyproject.toml", "utf-8");
      dependencies = parsePyProjectToml(pyProjectFile).dependencies;
      break;
    default:
      break;
  }

  return {
    dependencies,
    devDependencies,
  };
};

const getLatestVersion = async (packageName: string): Promise<any> => {
  try {
    const url = `https://registry.npmjs.org/${packageName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: any = await response.json();
    return data["dist-tags"]["latest"];
  } catch (error) {
    console.error(`Failed to get latest version of ${packageName}:`, error);
  }
};

export const installOrUpdate = async (
  packageManager: PackageManagerType,
  dependenciesToAdd: string[],
  dependenciesToUpdate: string[],
  typeOfAction: "install" | "update",
  options?: { oldVersion?: string; debug?: boolean },
) => {
  let runner = "";
  let installCommand: string[] = [];
  let updateCommand: string[] = [];
  let deleteCommand: string[] = [];
  const printLogs = options?.debug || false;

  switch (packageManager) {
    case "npm":
      runner = "npm";
      installCommand = ["install"];
      updateCommand = ["install", "--legacy-peer-deps"];
      break;
    case "yarn":
      runner = "yarn";
      installCommand = ["add"];
      updateCommand = ["add"];
      break;
    case "pnpm":
      runner = "pnpm";
      installCommand = ["install"];
      updateCommand = ["update"];
      break;
    case "pip":
      runner = "pip";
      installCommand = ["install"];
      updateCommand = ["install", "--upgrade"];
      break;
    case "pipenv":
      runner = "pipenv";
      installCommand = ["install"];
      updateCommand = ["update"];
      break;
    case "poetry":
      runner = "poetry";
      installCommand = ["add"];
      updateCommand = ["update"];
      break;
    case "go-modules":
      runner = "go";
      installCommand = ["get"];
      updateCommand = ["get", "-u"];
      break;
    case "brownie":
      runner = "brownie";
      installCommand = ["pm", "install"];
      updateCommand = ["pm", "update"];
      deleteCommand = ["pm", "delete"];
      break;
    case "foundry":
      runner = "forge";
      installCommand = ["install", "--no-commit"];
      updateCommand = ["update"];
      deleteCommand = ["remove"];
      break;
    default:
      break;
  }

  if (typeOfAction === "install") {
    if (!dependenciesToAdd.length) {
      return;
    }
    const commands = [...installCommand, ...dependenciesToAdd];

    await runCommand(runner, commands, printLogs);

    if (options?.oldVersion) {
      await runCommand(
        runner,
        [...deleteCommand, options.oldVersion],
        printLogs,
      );
    }
  }
  if (typeOfAction === "update") {
    if (!dependenciesToUpdate.length) {
      return;
    }
    const commands = [...updateCommand, ...dependenciesToUpdate];
    await runCommand(runner, commands, printLogs);
  }
};

export const checkIfBrowniePackageIsInstalled = async (regex: RegExp) => {
  const deps = await getDependenciesForBrownie();
  const match = deps.match(regex);
  if (match !== null) {
    const packageAndVersion = match[0];
    return {
      package: packageAndVersion,
      exists: true,
    };
  }
  return {
    package: "",
    exists: false,
  };
};

const getDependenciesForBrownie = async () => {
  let deps = "";
  await runCommand("brownie", ["pm", "list"], true, (data) => {
    deps += data.toString();
  });
  // strip out colors from output
  deps = deps.replace(/\u001b\[\d+(;\d+)*m/g, "");
  return deps;
};

export const getDependenciesForFoundry = async (
  filePath: string,
  libName: string,
) => {
  const fullPath = path.join(filePath, "lib", libName);
  return existsSync(fullPath);
};

type GoModule = {
  name: string;
  version: string;
};

export const getDependenciesForGo = (filePath: string): GoModule[] => {
  const content = readFileSync(filePath + "/go.mod", "utf-8");
  const lines = content.split("\n");
  const modules: GoModule[] = [];

  for (const line of lines) {
    if (line.includes("github.com/thirdweb-dev")) {
      const words = line.split(/\s+/); // split on any amount of whitespace
      const name = words[1].trim();
      const version = words[2];
      modules.push({ name, version });
    }
  }

  return modules;
};

export const processContractAppType = async (
  args: IProcessContractAppTypeArgs,
): Promise<void> => {
  const {
    detectedPackageManager,
    thirdwebDepsToUpdate,
    thirdwebDepsToInstall,
    isJSPackageManager,
  } = args;

  if (isJSPackageManager) {
    if (!thirdwebDepsToUpdate.has(`@thirdweb-dev/contracts`)) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/contracts`);
    }
  }

  if (detectedPackageManager === "brownie") {
    const latestThirdwebContractVersion = await getLatestVersion(
      "@thirdweb-dev/contracts",
    );

    // Exit out early if the user already has the latest version of thirdweb installed.
    if (
      thirdwebDepsToUpdate.has(
        `thirdweb-dev/contracts@${latestThirdwebContractVersion}`,
      )
    ) {
      return Promise.reject(
        "You already have the latest version of thirdweb-dev/contracts installed.",
      );
    }

    if (
      !thirdwebDepsToUpdate.has(
        `thirdweb-dev/contracts@${latestThirdwebContractVersion}`,
      )
    ) {
      thirdwebDepsToInstall.add(
        `thirdweb-dev/contracts@${latestThirdwebContractVersion}`,
      );
    }
  }

  if (detectedPackageManager === "foundry") {
    if (!thirdwebDepsToUpdate.has("lib/thirdweb-contracts")) {
      thirdwebDepsToInstall.add("thirdweb-contracts=thirdweb-dev/contracts");
    }
  }
};

export const processAppType = async (
  args: IProcessAppTypeArgs,
): Promise<void> => {
  const {
    detectedFramework,
    thirdwebDepsToUpdate,
    thirdwebDepsToInstall,
    hasEthers,
    isJSPackageManager,
    otherDeps,
    isPythonPackageManager,
    isGoPackageManager,
    detectedLibrary,
  } = args;

  const reactlibs = [
    "react",
    "react-native",
    "next",
    "gatsby",
    "cra",
    "remix",
    "vue",
    "vite",
    "svelte",
  ];
  const shouldInstallThirdwebReact = reactlibs.includes(
    detectedFramework as string,
  );
  const shouldInstallThirdwebReactNative = detectedLibrary === "react-native";

  if (isJSPackageManager) {
    if (
      !thirdwebDepsToUpdate.has(`@thirdweb-dev/react`) &&
      shouldInstallThirdwebReact
    ) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/react`);
    }
    if (
      !thirdwebDepsToUpdate.has(`@thirdweb-dev/sdk`) &&
      !shouldInstallThirdwebReactNative
    ) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/sdk`);
    }
    if (
      !thirdwebDepsToUpdate.has(`@thirdweb-dev/react-native`) &&
      shouldInstallThirdwebReactNative
    ) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/react-native`);
    }
    if (
      !thirdwebDepsToUpdate.has(`@thirdweb-dev/react-native-compat`) &&
      shouldInstallThirdwebReactNative
    ) {
      thirdwebDepsToInstall.add(`@thirdweb-dev/react-native-compat`);
    }
    if (!hasEthers) {
      otherDeps.add("ethers@5");
    }
  }

  if (isPythonPackageManager) {
    if (!thirdwebDepsToUpdate.has(`thirdweb-sdk`)) {
      thirdwebDepsToInstall.add(`thirdweb-sdk`);
    }
  }

  if (isGoPackageManager) {
    if (!thirdwebDepsToUpdate.has("github.com/thirdweb-dev/go-sdk/v2")) {
      thirdwebDepsToInstall.add("github.com/thirdweb-dev/go-sdk/v2");
    }
  }
};
