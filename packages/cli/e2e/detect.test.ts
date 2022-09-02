import { CREATE_MESSAGES } from "../constants/constants";
import { prepareEnvironment } from "@gmrchk/cli-testing-library";

// this creates an app, can take some time that's fine
jest.setTimeout(120_000);

describe("npx thirdweb detect", () => {
  it("should detect ERC721Base extensions", async () => {
    const { spawn, cleanup, exists, path } = await prepareEnvironment();
    const create = await spawn("node", "./dist/cli/index.js create");

    await create.waitForText(CREATE_MESSAGES.typeOfProject);
    await create.pressKey("arrowDown");
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.projectName);
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.framework);
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.contract);
    await create.pressKey("arrowDown");
    await create.pressKey("enter");

    // wait for program to finish
    await create.waitForFinish();

    // the process should exit with code 0
    expect(create.getExitCode()).toEqual(0);

    //check if the contract was created
    expect(await exists("thirdweb-contracts/contracts/Contract.sol")).toEqual(
      true,
    );
    
    //check that hardhat config exists
    expect(await exists("thirdweb-contracts/hardhat.config.js")).toEqual(
      true,
    );

    await create.writeText("cd thirdweb-contracts");
    await create.pressKey("enter");
    await create.writeText("npm install");
    await create.pressKey("enter");

    const detect = await spawn("node", "./dist/cli/index.js detect", "./thirdweb-contracts");

    // wait for program to finish
    await detect.waitForFinish();

    const lines = detect.getStdout();

    // Detected extensions
    expect(lines.findIndex((line) => line.includes("ERC721"))).toBeGreaterThan(
      -1,
    );
    expect(lines.findIndex((line) => line.includes("ERC721Burnable"))).toBeGreaterThan(
      -1,
    );
    expect(lines.findIndex((line) => line.includes("ERC721Mintable"))).toBeGreaterThan(
      -1,
    );
    
    // Suggested extensions
    expect(lines.findIndex((line) => line.includes("- ERC721Enumerable"))).toBeGreaterThan(
      -1,
    );
    expect(lines.findIndex((line) => line.includes("- ERC721Droppable"))).toBeGreaterThan(
      -1,
    );
    expect(lines.findIndex((line) => line.includes("- ERC721SignatureMint"))).toBeGreaterThan(
      -1,
    );

    // the process should exit with code 0
    expect(detect.getExitCode()).toEqual(0);

    await cleanup(); // cleanup after test
  });
});
