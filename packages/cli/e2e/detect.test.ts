import { CREATE_MESSAGES } from "../constants/constants";
import { prepareEnvironment } from "@gmrchk/cli-testing-library";

// load env variables
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-mono").load();

// this creates an app, can take some time that's fine
jest.setTimeout(240_000);

describe("npx thirdweb detect", () => {
  it("should detect ERC721Base extensions", async () => {
    const { spawn, cleanup, exists } = await prepareEnvironment();
    const create = await spawn("node", "./dist/cli/index.js create");

    await create.waitForText(CREATE_MESSAGES.typeOfProject);
    // select contract
    await create.pressKey("arrowDown");
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.projectName);
    // use default name
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.framework);
    // select hardhat
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.contractName);
    // set contract name
    await create.writeText("Contract");
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.contract);
    // select ERC721
    await create.pressKey("arrowDown");
    await create.pressKey("enter");
    await create.waitForText(CREATE_MESSAGES.extensions);
    // select no extra extensions
    await create.pressKey("enter");

    // wait for program to finish
    await create.waitForFinish();

    // check if the contract was created
    expect(await exists("thirdweb-contracts/contracts/Contract.sol")).toEqual(
      true,
    );

    // check that hardhat config exists
    expect(await exists("thirdweb-contracts/hardhat.config.js")).toEqual(true);

    await create.writeText("cd thirdweb-contracts");
    await create.pressKey("enter");
    await create.writeText("npm install");
    await create.pressKey("enter");

    const detect = await spawn(
      "node",
      "./dist/cli/index.js detect",
      "./thirdweb-contracts",
    );

    // Select pnpm as package manager.
    await detect.pressKey("arrowDown");
    await detect.pressKey("enter");

    // wait for program to finish
    await detect.waitForFinish();

    const lines = detect.getStdout();

    // Detected extensions
    expect(lines.findIndex((line) => line.includes("ERC721"))).toBeGreaterThan(
      -1,
    );
    expect(
      lines.findIndex((line) => line.includes("ERC721Burnable")),
    ).toBeGreaterThan(-1);
    expect(
      lines.findIndex((line) => line.includes("ERC721Mintable")),
    ).toBeGreaterThan(-1);

    // Suggested extensions
    expect(
      lines.findIndex((line) => line.includes("- ERC721Enumerable")),
    ).toBeGreaterThan(-1);
    expect(
      lines.findIndex((line) => line.includes("- ERC721LazyMintable")),
    ).toBeGreaterThan(-1);
    expect(
      lines.findIndex((line) => line.includes("- ERC721SignatureMint")),
    ).toBeGreaterThan(-1);

    await cleanup(); // cleanup after test
  });
});
