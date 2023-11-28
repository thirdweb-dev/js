import { execa } from "execa";
import fs from "node:fs/promises";
import ora from "ora";

const fixtures = await fs.readdir("./fixtures");

const spinner = ora("Running fixtures: ").start();

for (const fixture of fixtures) {
  spinner.suffixText = fixture;
  try {
    // write a basic template index.html file that includes the fixture
    await fs.writeFile(
      "./fixtures/index.html",
      `<html>
  <head>
    <script type="module" src="./${fixture}"></script>
  </head>
</html>
`,
    );

    await execa("vite", ["build", "fixtures/"]);
  } catch (error) {
    if (error.exitCode !== 0) {
      console.error(error);
      spinner.fail("Failed to run fixture: " + fixture);
      await fs.rm("./fixtures/index.html");
      await fs.rmdir("./fixtures/dist", { recursive: true });
      process.exit(1);
    }
  }
}

await fs.rm("./fixtures/index.html");
await fs.rmdir("./fixtures/dist", { recursive: true });

spinner.suffixText = "";
spinner.succeed("All fixtures ran successfully");
