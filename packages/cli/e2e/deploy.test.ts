import { prepareEnvironment } from "@gmrchk/cli-testing-library";
import { copyFile } from "fs/promises";
import { resolve } from "path";
import { ERROR_MESSAGES } from "../constants/constants";

// this creates an app, can take some time that's fine
jest.setTimeout(120_000);

describe("npx thirdweb deploy", () => {
  it("should return deploy page url", async () => {
    const { spawn, cleanup, exists, path } = await prepareEnvironment();
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    const apiKey = process.env.CLI_E2E_API_KEY as string;

    if (!apiKey) {
      throw new Error("CLI_E2E_API_KEY is not set in the environment variables");
    }

    await copyFile(
      resolve("./e2e/files/BasicContract.sol"),
      `${path}/BasicContract.sol`,
    );

    const { waitForText, waitForFinish, getExitCode, writeText, getStderr, debug } =
      await spawn("node", `./dist/cli/index.js deploy --contract -k ${apiKey}`);

    debug();
    expect(await exists("BasicContract.sol")).toEqual(true);

    await waitForText(ERROR_MESSAGES.noConfiguration);
    await writeText("y");

    // wait for program to finish
    await waitForFinish();
    debug();

    expect(getStderr().at(-1)).toContain(
      "https://thirdweb.com/contracts/deploy/",
    );

    // the process should exit with code 0
    expect(getExitCode()).toEqual(0);

    await cleanup(); // cleanup after test
  });
});
