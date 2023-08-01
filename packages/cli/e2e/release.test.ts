import { prepareEnvironment } from "@gmrchk/cli-testing-library";
import { copyFile } from "fs/promises";
import { resolve } from "path";
import { ERROR_MESSAGES } from "../constants/constants";

// load env variables
require("dotenv-mono").load();

// eslint-disable-next-line turbo/no-undeclared-env-vars
const apiSecretKey = process.env.TW_SECRET_KEY as string;

// function to skip tests based on condition
const itif = (condition: boolean) => (condition ? it : it.skip);

// this creates an app, can take some time that's fine
jest.setTimeout(120_000);

describe("npx thirdweb publish", () => {
  // conditionally skip test if there's no api key
  itif(!!apiSecretKey)("should return publish page url", async () => {
    const { spawn, cleanup, exists, path } = await prepareEnvironment();

    await copyFile(
      resolve("./e2e/files/BasicContract.sol"),
      `${path}/BasicContract.sol`,
    );

    const { waitForText, waitForFinish, getExitCode, writeText, getStderr } =
      await spawn("node", `./dist/cli/index.js publish -k ${apiSecretKey}`);

    expect(await exists("BasicContract.sol")).toEqual(true);

    await waitForText(ERROR_MESSAGES.noConfiguration);
    await writeText("y");

    // wait for program to finish
    await waitForFinish();

    expect(getStderr().at(-1)).toContain(
      "https://thirdweb.com/contracts/publish/",
    );

    // the process should exit with code 0
    expect(getExitCode()).toEqual(0);

    await cleanup(); // cleanup after test
  });
});
