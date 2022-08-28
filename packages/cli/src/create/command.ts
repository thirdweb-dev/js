#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
import { DownloadError, createApp } from "./helpers/create-app";
import { createContract } from "./helpers/create-contract";
import { getPkgManager } from "./helpers/get-pkg-manager";
import { validateNpmName } from "./helpers/validate-pkg";
import chalk from "chalk";
import path from "path";
import prompts from "prompts";

let projectType: string = "";
let projectPath: string = "";
let framework: string = "";
let language: string = "";
let baseContract: string = "";
/* let createType: string = "app"; */

export async function twCreate(options: any) {
  if (typeof projectPath === "string") {
    projectPath = projectPath.trim();
  }

  if (options.app) {
    projectType = "app";
  }

  if (options.contract) {
    projectType = "contract";
  }

  if (options.typescript) {
    language = "typescript";
  }

  if (options.javascript) {
    language = "javascript";
  }

  if (options.next) {
    framework = "next";
  }

  if (options.cra) {
    framework = "cra";
  }

  if (options.vite) {
    framework = "vite";
  }

  if (options.forge) {
    framework = "forge";
  }

  if (options.hardhat) {
    framework = "hardhat";
  }

  if (options.framework) {
    framework = options.framework;
  }

  if (!projectType && !options.template) {
    const res = await prompts({
      type: "select",
      name: "projectType",
      message: "What type of project do you want to create?",
      choices: [
        { title: "App", value: "app" },
        { title: "Contract", value: "contract" },
      ],
    });

    if (typeof res.projectType === "string") {
      projectType = res.projectType.trim();
    }
  } else if (!projectType && options.template) {
    // If no project type is specified, but a template is, we assume the user wants to create an app.
    // We do this so old users can still use the --template flag to create an app.
    projectType = "app";
  }

  if (!projectPath) {
    const defaultName =
      projectType === "contract" ? "thirdweb-contracts" : "thirdweb-app";
    const res = await prompts({
      type: "text",
      name: "path",
      message: "What is your project named?",
      initial: options.template || defaultName,
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)));
        if (validation.valid) {
          return true;
        }
        return "Invalid project name: " + validation.problems![0];
      },
    });

    if (typeof res.path === "string") {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    console.log(
      "\nPlease specify the project directory:\n" +
        `  ${chalk.cyan("npx thirdweb create")} ${chalk.green(
          "<project-directory>",
        )}\n` +
        "For example:\n" +
        `  ${chalk.cyan("npx thirdweb create")} ${chalk.green(
          "my-thirdweb-app",
        )}\n\n` +
        `Run ${chalk.cyan("npx thirdweb --help")} to see all options.`,
    );
    process.exit(1);
  }

  if (!options.template) {
    if (projectType === "app" && !framework) {
      const res = await prompts({
        type: "select",
        name: "framework",
        message: "What framework do you want to use?",
        choices: [
          { title: "Next.js", value: "next" },
          { title: "Create React App", value: "cra" },
          { title: "Vite", value: "vite" },
        ],
      });

      if (typeof res.framework === "string") {
        framework = res.framework.trim();
      }
    }

    if (projectType === "app" && !language) {
      const res = await prompts({
        type: "select",
        name: "language",
        message: "What language do you want to use?",
        choices: [
          { title: "JavaScript", value: "javascript" },
          { title: "TypeScript", value: "typescript" },
        ],
      });

      if (typeof res.language === "string") {
        language = res.language.trim();
      }
    }

    if (
      projectType === "contract" &&
      framework !== "forge" &&
      framework !== "hardhat"
    ) {
      const res = await prompts({
        type: "select",
        name: "framework",
        message: "What framework do you want to use?",
        choices: [
          { title: "Hardhat", value: "hardhat" },
          { title: "Forge", value: "forge" },
        ],
      });

      if (typeof res.framework === "string") {
        framework = res.framework.trim();
      }
    }

    // Select base contract
    if (projectType === "contract" && !baseContract) {
      const res = await prompts({
        type: "select",
        name: "baseContract",
        message: "What contract do you want to start from?",
        choices: [
          { title: "Empty Contract", value: "" },
          { title: "ERC721 Base", value: "ERC721Base" },
          { title: "ERC721 + Signature Mint", value: "ERC721Signature" },
          { title: "ERC721 + Lazy Mint", value: "ERC721LazyMint" },
          { title: "ERC721 + Delayed Reveal", value: "ERC721DelayedReveal" },
          { title: "ERC721 + Drop", value: "ERC721Drop" },
          { title: "ERC1155 Base", value: "ERC1155Base" },
          { title: "ERC1155 + Signature Mint", value: "ERC1155Signature" },
          { title: "ERC1155 + Lazy Mint", value: "ERC1155LazyMint" },
          { title: "ERC1155 + Delayed Reveal", value: "ERC1155DelayedReveal" },
          { title: "ERC1155 + Drop", value: "ERC1155Drop" },
          { title: "ERC20 Base", value: "ERC20Base" },
          { title: "ERC20 + Vote", value: "ERC20Vote" },
          { title: "ERC20 + Signature Mint", value: "ERC20SignatureMint" },
          {
            title: "ERC20 + Vote + Signature Mint",
            value: "ERC20SignatureMintVote",
          },
          { title: "ERC20 + Drop", value: "ERC20Drop" },
          { title: "ERC20 + Vote + Drop", value: "ERC20DropVote" },
        ],
      });

      if (typeof res.baseContract === "string") {
        baseContract = res.baseContract.trim();
      }
    }

    if (!framework) {
      console.log("Please specify a framework");
      process.exit(1);
    }

    if (!language) {
      // Default = JavaScript
      language = "javascript";
    }
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const { valid, problems } = validateNpmName(projectName);
  if (!valid) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${projectName}"`,
      )} because of npm naming restrictions:`,
    );

    problems!.forEach((p) => console.error(`    ${chalk.red.bold("*")} ${p}`));
    process.exit(1);
  }

  if (options.template === true) {
    console.error(
      "Please provide an template name, otherwise remove the template option. Checkout some templates you can use here: https://github.com/thirdweb-example/",
    );
    process.exit(1);
  }

  const packageManager = !!options.useNpm
    ? "npm"
    : !!options.usePnpm
    ? "pnpm"
    : getPkgManager();

  const template =
    typeof options.template === "string" && options.template.trim();
  try {
    if (projectType === "app") {
      await createApp({
        appPath: resolvedProjectPath,
        packageManager,
        framework,
        language,
        template,
      });
    } else {
      await createContract({
        contractPath: resolvedProjectPath,
        packageManager,
        framework,
        baseContract,
      });
    }
  } catch (reason) {
    if (!(reason instanceof DownloadError)) {
      throw reason;
    }
  }
}
