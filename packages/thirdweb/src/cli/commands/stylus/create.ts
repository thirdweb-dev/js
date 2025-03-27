import { spawnSync } from "node:child_process";
import ora from "ora";
import prompts from "prompts";

export async function createStylusProject() {
  const spinner = ora();

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

  spawnSync("rustup", ["default", "1.83"], {
    stdio: "inherit",
  });
  spawnSync("rustup", ["target", "add", "wasm32-unknown-unknown"], {
    stdio: "inherit",
  });

  // Step 3: Create the project
  const { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name:",
    initial: "my-stylus-project",
  });
  spinner.start(`Creating new Stylus project: ${projectName}...`);
  const newProject = spawnSync("cargo", ["stylus", "new", projectName], {
    stdio: "inherit",
  });
  if (newProject.status !== 0) {
    spinner.fail("Failed to create Stylus project.");
    process.exit(1);
  }
  spinner.succeed("Project created successfully.");

  console.log(`\n✅ Done! cd into your project: ${projectName}`);
}
