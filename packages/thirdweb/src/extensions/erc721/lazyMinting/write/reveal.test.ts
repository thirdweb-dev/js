import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { reveal } from "./reveal.js";

describe("reveal", () => {
  let contract: ThirdwebContract;
  beforeAll(() => {
    contract = getContract({
      chain: ANVIL_CHAIN,
      address: "0x708781BAE850faA490cB5b5b16b4687Ec0A8D65D",
      client: TEST_CLIENT,
    });
  });

  it("should throw an error if password is missing", async () => {
    const options = {
      contract,
      batchId: 1n,
      password: "",
    };

    expect(() => reveal(options)).toThrowError("Password is required");
  });
});
