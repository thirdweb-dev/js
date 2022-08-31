import { prepareEnvironment } from "@gmrchk/cli-testing-library";

// this creates an app, can take some time that's fine
jest.setTimeout(120_000);

describe("npx thirdweb create", () => {
  it("should create app successfully", async () => {
    const { spawn, cleanup, exists } = await prepareEnvironment();
    const {
      // wait,
      waitForText,
      waitForFinish,
      // getStdout,
      // getStderr,
      getExitCode,
      // debug,
      pressKey,
    } = await spawn("node", "./dist/cli/index.js create");

    await waitForText("What type of project do you want to create?");
    await pressKey("enter");
    await waitForText("What is your project named?");
    await pressKey("enter");
    await waitForText("What framework do you want to use?");
    await pressKey("arrowDown");
    await pressKey("enter");
    await waitForText("What language do you want to use?");
    await pressKey("enter");

    // wait for program to finish
    await waitForFinish();

    //check if the app was created
    expect(await exists("thirdweb-app/package.json")).toEqual(true);

    // the process should exit with code 0
    expect(getExitCode()).toEqual(0);

    await cleanup(); // cleanup after test
  });
});
