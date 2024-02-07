import { describe, it, expect } from "vitest";
import { getByteCode } from "../../contract/index.js";
import {
  DOODLES_CONTRACT,
  USDC_CONTRACT,
} from "../../../test/src/test-contracts.js";
import { extractIPFSUri } from "./extractIPFS.js";

describe("extractIPFSUri", () => {
  it("works if ipfs is there", async () => {
    //  get some bytecode
    const bytecode = await getByteCode(DOODLES_CONTRACT);
    //  extract IPFS hash
    const ipfsHash = extractIPFSUri(bytecode);

    // DOODLES bytecode contains an IPFS hash
    expect(ipfsHash).toMatchInlineSnapshot(
      `"ipfs://QmRKWTE2aFc8VZdsHAZ8B7vMStPBFwn4AQr7WGUhjkuJWb"`,
    );
  });

  it("does not work if ipfs is not there", async () => {
    //  get some bytecode
    const bytecode = await getByteCode(USDC_CONTRACT);
    //  extract IPFS hash
    const ipfsHash = extractIPFSUri(bytecode);

    // USDC bytecode does not contain an IPFS hash
    expect(ipfsHash).toMatchInlineSnapshot(`undefined`);
  });

  it("works with the weird mumbai contract", async () => {
    const ipfsHash = extractIPFSUri(
      "0x363d3d373d3d3d363d30545af43d82803e903d91601857fd5bf3",
    );
    expect(ipfsHash).toMatchInlineSnapshot(`undefined`);
  });
});
