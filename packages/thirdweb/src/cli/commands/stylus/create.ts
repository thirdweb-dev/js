import { spawnSync } from "node:child_process";
import ora from "ora";
import prompts from "prompts";
import { checkPrerequisites } from "./check-prerequisites.js";

export async function createStylusProject() {
  const spinner = ora();

  checkPrerequisites(spinner, "cargo", ["--version"], "Rust (cargo)");
  checkPrerequisites(spinner, "rustc", ["--version"], "Rust compiler (rustc)");
  checkPrerequisites(
    spinner,
    "solc",
    ["--version"],
    "Solidity compiler (solc)",
  );

  // Step 1: Ensure cargo is installed
  const cargoCheck = spawnSync("cargo", ["--version"]);
  if (cargoCheck.status !== 0) {
    console.error("Error: `cargo` is not installed");
    process.exit(1);
  }

  // Step 2: Install stylus etc.
  spinner.start("Installing Stylus...");
  const install = spawnSync("cargo", ["install", "--force", "cargo-stylus"], {
    stdio: "inherit",
  });
  if (install.status !== 0) {
    spinner.fail("Failed to install Stylus.");
    process.exit(1);
  }
  spinner.succeed("Stylus installed.");

  spawnSync("rustup", ["default", "1.87"], {
    stdio: "inherit",
  });
  spawnSync("rustup", ["target", "add", "wasm32-unknown-unknown"], {
    stdio: "inherit",
  });

  // Step 3: Create the project
  const { projectName } = await prompts({
    initial: "my-stylus-project",
    message: "Project name:",
    name: "projectName",
    type: "text",
  });

  // Step 4: Select project type
  const { projectType } = await prompts({
    choices: [
      { title: "Default", value: "default" },
      { title: "ERC20", value: "erc20" },
      { title: "ERC721", value: "erc721" },
      { title: "ERC1155", value: "erc1155" },
      { title: "Airdrop ERC20", value: "airdrop20" },
      { title: "Airdrop ERC721", value: "airdrop721" },
      { title: "Airdrop ERC1155", value: "airdrop1155" },
      { title: "ZK ERC721", value: "zk-erc721" },
      { title: "ZK ERC20", value: "zk-erc20" },
      { title: "Mint module - ERC20", value: "mintable20" },
      { title: "Transfer module - ERC20", value: "transferable20" },
      { title: "Mint module - ERC721", value: "mintable721" },
      { title: "Transfer module - ERC721", value: "transferable721" },
      { title: "Mint module - ERC1155", value: "mintable1155" },
      { title: "Transfer module - ERC1155", value: "transferable1155" },
    ],
    message: "Select a template:",
    name: "projectType",
    type: "select",
  });

  // Step 5: Create the project
  // biome-ignore lint/suspicious/noImplicitAnyLet: <>
  let newProject;
  if (projectType === "default") {
    spinner.start(`Creating new Stylus project: ${projectName}...`);
    newProject = spawnSync("cargo", ["stylus", "new", projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "erc20") {
    const repoUrl = "git@github.com:thirdweb-example/stylus-erc20-template.git";
    spinner.start(`Creating new ERC20 Stylus project: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "erc721") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-erc721-template.git";
    spinner.start(`Creating new ERC721 Stylus project: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "erc1155") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-erc1155-template.git";
    spinner.start(`Creating new ERC1155 Stylus project: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "airdrop20") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-airdrop-erc20-template.git";
    spinner.start(
      `Creating new Airdrop ERC20 Stylus project: ${projectName}...`,
    );
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "airdrop721") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-airdrop-erc721-template.git";
    spinner.start(
      `Creating new Airdrop ERC721 Stylus project: ${projectName}...`,
    );
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "airdrop1155") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-airdrop-erc1155-template.git";
    spinner.start(
      `Creating new Airdrop ERC1155 Stylus project: ${projectName}...`,
    );
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "zk-erc721") {
    const repoUrl = "git@github.com:thirdweb-example/stylus-zk-erc721.git";
    spinner.start(`Creating new ZK ERC721 Stylus project: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "zk-erc20") {
    const repoUrl = "git@github.com:thirdweb-example/stylus-zk-erc20.git";
    spinner.start(`Creating new ZK ERC20 Stylus project: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "mintable20") {
    const repoUrl = "git@github.com:thirdweb-example/stylus-mintable-erc20.git";
    spinner.start(`Creating new ERC20 Mintable module: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "transferable20") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-transferable-erc20.git";
    spinner.start(`Creating new ERC20 Transferable module: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "mintable721") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-mintable-erc721.git";
    spinner.start(`Creating new ERC721 Mintable module: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "transferable721") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-transferable-erc721.git";
    spinner.start(`Creating new ERC721 Transferable module: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "mintable1155") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-mintable-erc1155.git";
    spinner.start(`Creating new ERC1155 Mintable module: ${projectName}...`);
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  } else if (projectType === "transferable1155") {
    const repoUrl =
      "git@github.com:thirdweb-example/stylus-transferable-erc1155.git";
    spinner.start(
      `Creating new ERC1155 Transferable module: ${projectName}...`,
    );
    newProject = spawnSync("git", ["clone", repoUrl, projectName], {
      stdio: "inherit",
    });
  }

  if (!newProject || newProject.status !== 0) {
    spinner.fail("Failed to create Stylus project.");
    process.exit(1);
  }

  spinner.succeed("Project created successfully.");
  console.log(`\n✅ cd into your project: ${projectName}`);
}
