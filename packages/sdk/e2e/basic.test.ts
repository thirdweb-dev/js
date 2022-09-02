import { prepareEnvironment } from "@gmrchk/cli-testing-library";
import { expect } from "chai";

describe("node", () => {
  it("getContract().metadata.get()", async () => {
    const { execute, cleanup } = await prepareEnvironment();

    const { code, stdout, stderr } = await execute(
      "node",
      "./e2e/node-scripts/basic.js",
    );

    expect(code).to.equal(0);
    expect(stdout[0]).to.contain("mintED Toasts");
    expect(stderr.length).to.equal(0);

    await cleanup();
  });
});
