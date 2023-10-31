import { CREATE_MESSAGES } from "../constants/constants";
import { prepareEnvironment } from "@gmrchk/cli-testing-library";

// load env variables
require("dotenv-mono").load();

// this creates an app, can take some time that's fine
jest.setTimeout(150_000);

describe("npx thirdweb create", () => {
  it("should create app (CRA) successfully", async () => {
    const { spawn, cleanup, exists } = await prepareEnvironment();
    const { waitForText, waitForFinish, getExitCode, pressKey } = await spawn(
      "node",
      "./dist/cli/index.js create",
    );

    await waitForText(CREATE_MESSAGES.typeOfProject);
    await pressKey("enter");
    await waitForText(CREATE_MESSAGES.projectName);
    await pressKey("enter");
    await waitForText(CREATE_MESSAGES.framework);
    // select CRA
    await pressKey("arrowDown");
    await pressKey("enter");
    await waitForText(CREATE_MESSAGES.language);
    await pressKey("enter");

    // wait for program to finish
    await waitForFinish();

    // check if the app was created
    expect(await exists("thirdweb-app/package.json")).toEqual(true);

    // the process should exit with code 0
    expect(getExitCode()).toEqual(0);

    await cleanup(); // cleanup after test
  });
});
