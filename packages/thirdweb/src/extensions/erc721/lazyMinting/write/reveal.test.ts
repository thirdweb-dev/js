import { beforeAll, describe, expect, it, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { reveal } from "./reveal.js";

const mocks = vi.hoisted(() => ({
  simulateTransaction: vi.fn(),
}));

vi.mock("../../../../transaction/actions/simulate.js", () => ({
  simulateTransaction: mocks.simulateTransaction,
}));

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

  it("should successfully prepare a reveal transaction", async () => {
    const options = {
      contract,
      batchId: 1n,
      password: "securepassword",
    };

    mocks.simulateTransaction.mockResolvedValue(
      "ipfs://correctly_decrypted_uri/",
    );

    const tx = reveal(options);
    if (typeof tx.data === "function") {
      await tx.data();
    }

    expect(mocks.simulateTransaction).toHaveBeenCalled();
  });

  it("should throw an error if the decrypted URI is invalid", async () => {
    const options = {
      contract,
      batchId: 1n,
      password: "securepassword",
    };

    mocks.simulateTransaction.mockResolvedValue("invalid_uri");

    const tx = reveal(options);
    if (typeof tx.data === "function") {
      expect(tx.data()).rejects.toThrow("Invalid reveal password");
    } else {
      throw new Error("Something went wrong");
    }
  });
});
