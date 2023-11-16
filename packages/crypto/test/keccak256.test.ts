import {
  keccak256SyncHex,
  keccak256SyncHexPrefixed,
  keccak256Sync,
} from "../src";
import { utils } from "ethers";
import { keccak_256 } from "@noble/hashes/sha3";
import { uint8ArrayToHex } from "../src/utils/uint8array-extras";

const STRING_TO_HASH = "hello world";

describe("keccak256", () => {
  it("keccak256SyncHexPrefixed === ethers.utils.keccak256", async () => {
    const out = keccak256SyncHexPrefixed(STRING_TO_HASH);
    const ethersOut = utils.keccak256(Buffer.from(STRING_TO_HASH));

    expect(out).toEqual(ethersOut);
  });
  it("keccak256SyncHex === @noble/hashes: keccak_256 -> hex", async () => {
    const out = keccak256SyncHex(STRING_TO_HASH);
    const nobleOut = uint8ArrayToHex(keccak_256(STRING_TO_HASH));
    expect(out).toEqual(nobleOut);
  });

  it("keccak256Sync ===  @noble/hashes: keccak_256", async () => {
    const out = keccak256Sync(STRING_TO_HASH);
    const nobleOut = keccak_256(STRING_TO_HASH);
    expect(out).toEqual(nobleOut);
  });
});
