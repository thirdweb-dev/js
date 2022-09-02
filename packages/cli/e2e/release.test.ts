import { prepareEnvironment } from "@gmrchk/cli-testing-library";
import { copyFile } from "fs/promises";
import { resolve } from "path";

// this creates an app, can take some time that's fine
jest.setTimeout(120_000);

describe("npx thirdweb release", () => {
  it("should return release page url", async () => {
    const { spawn, cleanup, exists, path } = await prepareEnvironment();

    await copyFile(resolve("./e2e/files/BasicContract.sol"), `${path}/BasicContract.sol`);

    const {
      waitForText,
      waitForFinish,
      getExitCode,
      writeText,
      getStdout,
    } = await spawn("node", "./dist/cli/index.js release");

    expect(await exists("BasicContract.sol")).toEqual(true);

    await waitForText("Failed to find a supported project configuration");
    await writeText("y")

    // wait for program to finish
    await waitForFinish();

    expect(getStdout().at(-1)).toEqual("https://thirdweb.com/contracts/release/QmXENbPLE5wkAhyUr7y2YShsUHLTtgaG1CvQffUaek6pNN");

    // the process should exit with code 0
    expect(getExitCode()).toEqual(0);

    await cleanup(); // cleanup after test
  });
});
