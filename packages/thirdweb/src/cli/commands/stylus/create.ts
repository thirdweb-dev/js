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
	}

	if (!newProject || newProject.status !== 0) {
		spinner.fail("Failed to create Stylus project.");
		process.exit(1);
	}

	spinner.succeed("Project created successfully.");
	console.log(`\n✅ cd into your project: ${projectName}`);
}
