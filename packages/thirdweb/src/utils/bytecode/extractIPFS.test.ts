import { describe, expect, it } from "vitest";
import {
  DOODLES_CONTRACT,
  USDT_CONTRACT,
} from "../../../test/src/test-contracts.js";
import { getBytecode } from "../../contract/actions/get-bytecode.js";
import { extractIPFSUri } from "./extractIPFS.js";

// skip this test suite if there is no secret key available to test with
// TODO: remove reliance on secret key during unit tests entirely
describe.runIf(process.env.TW_SECRET_KEY)("extractIPFSUri", () => {
  it("works if ipfs is there", async () => {
    //  get some bytecode
    const bytecode = await getBytecode(DOODLES_CONTRACT);
    //  extract IPFS hash
    const ipfsHash = extractIPFSUri(bytecode);

    // DOODLES bytecode contains an IPFS hash
    expect(ipfsHash).toMatchInlineSnapshot(
      `"ipfs://QmRKWTE2aFc8VZdsHAZ8B7vMStPBFwn4AQr7WGUhjkuJWb"`,
    );
  });

  it("does not work if ipfs is not there", async () => {
    //  get some bytecode
    const bytecode = await getBytecode(USDT_CONTRACT);
    //  extract IPFS hash
    const ipfsHash = extractIPFSUri(bytecode);

    // USDC bytecode does not contain an IPFS hash
    expect(ipfsHash).toMatchInlineSnapshot("undefined");
  });
});
