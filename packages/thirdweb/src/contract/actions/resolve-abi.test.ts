import { describe, expect, it } from "vitest";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { DOODLES_ABI } from "../../../test/src/abis/doodles.js";
import {
  resolveAbiFromBytecode,
  resolveAbiFromContractApi,
  resolveContractAbi,
} from "./resolve-abi.js";

describe("resolveContractAbi", () => {
  it("should use the abi on the contract if it exists", async () => {
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT, abi: DOODLES_ABI };
    const abi = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi).toMatchObject(DOODLES_ABI);
  });

  it("should resolve abi from contract", async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
    const abi = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi).toMatchObject(DOODLES_ABI);
  });

  it("should cache the result on a contract level", async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
    const abi1 = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi1).toMatchObject(DOODLES_ABI);

    const abi2 = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi2).toMatchObject(DOODLES_ABI);
  });
});

it("should resolve abi from contract api", async () => {
  // we do this so we don't hit any PRIOR cache
  const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
  const abi = await resolveAbiFromContractApi(DOODLES_CONTRACT_CLONE);
  expect(abi).toMatchObject(DOODLES_ABI);
});

it.runIf(process.env.TW_SECRET_KEY)(
  "should resolve abi from bytecode",
  async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
    const abi = await resolveAbiFromBytecode(DOODLES_CONTRACT_CLONE);
    expect(abi).toMatchObject(DOODLES_ABI);
  },
);
