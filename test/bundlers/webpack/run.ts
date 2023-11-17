import { execa } from "execa";
import fs from "node:fs/promises";
import ora from "ora";

const fixtures = await fs.readdir("./fixtures");

const spinner = ora("Running fixtures: ").start();

for (const fixture of fixtures) {
  spinner.suffixText = fixture;
  try {
    await execa("webpack", ["build", "./fixtures/" + fixture]);
  } catch (error) {
    if (error.exitCode !== 0) {
      console.error(error);

      spinner.fail("Fixture failed:");

      await fs.rmdir("./dist", { recursive: true });
      process.exit(1);
    }
  }
}

await fs.rmdir("./dist", { recursive: true });

spinner.suffixText = "";
spinner.succeed("All fixtures ran successfully");
