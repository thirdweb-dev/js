import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../../contract/contract.js";
import { reveal } from "./reveal.js";

describe("reveal", () => {
  let contract: ThirdwebContract;
  beforeAll(() => {
    contract = getContract({
      address: "0x708781BAE850faA490cB5b5b16b4687Ec0A8D65D",
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  });

  it("should throw an error if password is missing", async () => {
    const options = {
      batchId: 1n,
      contract,
      password: "",
    };

    expect(() => reveal(options)).toThrowError("Password is required");
  });
});
