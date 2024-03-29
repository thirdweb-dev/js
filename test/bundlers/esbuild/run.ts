import { execa } from "execa";
import fs from "node:fs/promises";
import ora from "ora";

const fixtures = await fs.readdir("./fixtures");

const spinner = ora("Running fixtures: ").start();

for (const fixture of fixtures) {
  spinner.suffixText = fixture;
  try {
    await execa("esbuild", ["fixtures/" + fixture, "--bundle"]);
  } catch (error) {
    if (error.exitCode !== 0) {
      console.error(error);
      spinner.fail("Failed to run fixture: " + fixture);
      // await fs.rm("./fixtures/index.html");

      process.exit(1);
    }
  }
}

// await fs.rm("./fixtures/index.html");

spinner.suffixText = "";
spinner.succeed("All fixtures ran successfully");
