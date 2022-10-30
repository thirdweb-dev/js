#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
import { CREATE_MESSAGES } from "../../constants/constants";
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

export async function twCreate(pPath: string = "", options: any) {
  if (typeof pPath === "string") {
    projectPath = pPath;
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
      message: CREATE_MESSAGES.typeOfProject,
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
      message: CREATE_MESSAGES.projectName,
      initial: options.template || defaultName,
      format: (name: string) => name.toLowerCase(),
      validate: (name: string) => {
        const validation = validateNpmName(
          path.basename(path.resolve(name.toLowerCase())),
        );
        if (validation.valid) {
          return true;
        }
        return "Invalid project name: " + validation.problems?.[0];
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
        message: CREATE_MESSAGES.framework,
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
        message: CREATE_MESSAGES.language,
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
        message: CREATE_MESSAGES.framework,
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
      let standard = "none";
      const standardPrompt = await prompts({
        type: "select",
        name: "standard",
        message: CREATE_MESSAGES.contract,
        choices: [
          { title: "Empty Contract", value: "none" },
          { title: "ERC721", value: "erc721" },
          { title: "ERC20", value: "erc20" },
          { title: "ERC1155", value: "erc1155" },
        ],
      });

      if (typeof standardPrompt.standard === "string") {
        standard = standardPrompt.standard.trim();
      }

      if (standard === "none") {
        baseContract = "";
      } else {
        let choices: prompts.Choice[] = [];
        if (standard === "erc721") {
          choices = [
            { title: "None", value: "ERC721Base" },
            { title: "Signature Mint", value: "ERC721SignatureMint" },
            { title: "Lazy Mint", value: "ERC721LazyMint" },
            { title: "Delayed Reveal", value: "ERC721DelayedReveal" },
            { title: "Drop", value: "ERC721Drop" },
          ];
        } else if (standard === "erc20") {
          choices = [
            { title: "None", value: "ERC20Base" },
            { title: "Vote", value: "ERC20Vote" },
            { title: "Signature Mint", value: "ERC20SignatureMint" },
            { title: "Vote + Signature Mint", value: "ERC20SignatureMintVote" },
            { title: "Drop", value: "ERC20Drop" },
            { title: "Vote + Drop", value: "ERC20DropVote" },
          ];
        } else if (standard === "erc1155") {
          choices = [
            { title: "None", value: "ERC1155Base" },
            { title: "Signature Mint", value: "ERC1155SignatureMint" },
            { title: "Lazy Mint", value: "ERC1155LazyMint" },
            { title: "Delayed Reveal", value: "ERC1155DelayedReveal" },
            { title: "Drop", value: "ERC1155Drop" },
          ];
        }

        const res = await prompts({
          type: "select",
          name: "baseContract",
          message: CREATE_MESSAGES.extensions,
          choices: choices,
        });

        if (typeof res.baseContract === "string") {
          baseContract = res.baseContract.trim();
        }
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

    problems?.forEach((p) => console.error(`    ${chalk.red.bold("*")} ${p}`));
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
