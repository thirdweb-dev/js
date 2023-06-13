import { findMatches } from "../common/file-helper";
import { AppType, ContractLibrariesType, FrameworkType, LanguageType, LibraryType, PackageManagerType } from "../core/types/ProjectType";
import { runCommand } from "../create/helpers/run-command";
import { exec } from "child_process";
import chokidar from 'chokidar';
import { generate } from "../generate/command";

export const runDevEnv = async (detections: {
  detectedPackageManager: PackageManagerType;
  detectedLanguage: LanguageType;
  detectedLibrary: LibraryType;
  detectedFramework: FrameworkType;
  detectedAppType: AppType;
  detectedContractLibrary: ContractLibrariesType;
}, projectPath: {
  path: string;
}) => {
  const { detectedPackageManager, detectedFramework } = detections;
  let runner: string = "";
  let devCommand: string[] = [];

  switch (detectedPackageManager) {
    case "npm":
    case "yarn":
    case "pnpm":
      const { runner: jsRunner, devCommand: jsDevCommand } = getJsDevCommand(detectedFramework, detectedPackageManager);
      runner = jsRunner;
      devCommand = jsDevCommand;
      break;
    case "pip":
    case "pipenv":
    case "poetry":
      const { runner: pythonRunner, devCommand: pythonDevCommand } = getPythonDevCommand(detectedFramework, detectedPackageManager);
      runner = pythonRunner;
      devCommand = pythonDevCommand;
      break;
    case "go-modules":
      const { runner: goRunner, devCommand: goDevCommand } = getGoDevCommand(detectedFramework, projectPath.path);
      runner = goRunner;
      devCommand = goDevCommand;
      break;
    default:
      break;
  }

    // Initialize watcher.
  let watcher = chokidar.watch(projectPath.path, {
    ignored: [
      /(^|[\/\\])\../, // ignore dotfiles
      '**/node_modules/**', // ignore node_modules
      'package.json', // ignore package.json
      'thirdweb.json' // ignore thirdweb.json
    ],
    persistent: true
  });

  // Something to use when events are received.
  const log = console.log.bind(console);

  watcher
    .on('change', async file => {
      log(`File ${file} has been changed`);
      // Re-run the generate command on file change.
      await generate({ path: projectPath.path, logs: false });
    })
    .on('unlink', path => log(`File ${path} has been removed`));

  // Start npm run dev initially
  await runCommand(runner, devCommand, true);

  // On Ctrl+C or server stop, clean up watcher.
  process.on('SIGINT', () => {
    watcher.close();
    process.exit();
  });

  process.on('SIGTERM', () => {
    watcher.close();
    process.exit();
  });
};

const getJsDevCommand = (detectedFramework: FrameworkType, detectedPackageManager: PackageManagerType) => {
  switch (detectedFramework) {
    case "next":
      return {
        runner: detectedPackageManager,
        devCommand: ["run", "dev"],
      };
    case "gatsby":
      return {
        runner: "gatsby",
        devCommand: ["develop"],
      };
    case "remix":
      return {
        runner: detectedPackageManager,
        devCommand: ["run", "dev"],
      };
    case "cra":
      return {
        runner: detectedPackageManager,
        devCommand: ["start"],
      };
    case "vue":
      return {
        runner: detectedPackageManager,
        devCommand: ["run", "serve"],
      };
    case "expo":
      return {
        runner: "expo",
        devCommand: ["start"],
      };
    case "react-native-cli":
      return {
        runner: "react-native",
        devCommand: ["run-android"],
      };
    case "express":
      return {
        runner: "node",
        devCommand: ["server.js"],
      };
    case "fastify":
      return {
        runner: "node",
        devCommand: ["server.js"],
      };
    default:
      return {
        runner: "",
        devCommand: [""],
      };
  }
};

const getPythonDevCommand = (detectedFramework: FrameworkType, detectedPackageManager: PackageManagerType) => {
  const isPipEnv = detectedPackageManager === "pipenv";
  const isPoetry = detectedPackageManager === "poetry";
  const prefix = isPipEnv ? "pipenv run " : isPoetry ? "poetry run " : "";

  switch (detectedFramework) {
    case "django":
      return {
        runner: prefix + "python",
        devCommand: ["manage.py", "runserver"],
      };
    case "flask":
      return {
        runner: prefix + "python",
        devCommand: ["app.py"],
      };
    case "fastapi":
      return {
        runner: prefix + "uvicorn",
        devCommand: ["main:app", "--reload"],
      };
    default:
      return {
        runner: "",
        devCommand: [""],
      };
  }
};

const getGoDevCommand = (detectedFramework: FrameworkType, projectPath: string) => {
  switch (detectedFramework) {
    case "gin":
      return {
        runner: "go",
        devCommand: ["run", "main.go"],
      };
    case "echo":
      return {
        runner: "go",
        devCommand: ["run", "main.go"],
      };
    case "revel":
      return {
        runner: "revel",
        devCommand: ["run", projectPath],
      };
    case "fiber":
      return {
        runner: "go",
        devCommand: ["run", "main.go"],
      };
    default:
      return {
        runner: "",
        devCommand: [""],
      };
  }
};