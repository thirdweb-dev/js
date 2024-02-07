import { describe, it, expect, vi, afterEach } from "vitest";
import {
  resolveAbiFromContractApi,
  resolveContractAbi,
  resolveAbiFromBytecode,
} from "./resolve-abi.js";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { DOODLES_ABI } from "../../../test/src/abis/doodles.js";

const fetchSpy = vi.spyOn(globalThis, "fetch");

describe("resolveContractAbi", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });

  it("should use the abi on the contract if it exists", async () => {
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT, abi: DOODLES_ABI };
    const abi = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi).toMatchObject(DOODLES_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(0);
  });

  it("should resolve abi from contract", async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
    const abi = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi).toMatchObject(DOODLES_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should cache the result on a contract level", async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
    const abi1 = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi1).toMatchObject(DOODLES_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `https://contract.thirdweb.com/abi/1/${DOODLES_CONTRACT_CLONE.address}`,
      expect.any(Object),
    );
    const abi2 = await resolveContractAbi(DOODLES_CONTRACT_CLONE);
    expect(abi2).toMatchObject(DOODLES_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe("resolveAbiFromContractApi", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it("should resolve abi from contract api", async () => {
    // we do this so we don't hit any PRIOR cache
    const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
    const abi = await resolveAbiFromContractApi(DOODLES_CONTRACT_CLONE);
    expect(abi).toMatchObject(DOODLES_ABI);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `https://contract.thirdweb.com/abi/1/${DOODLES_CONTRACT_CLONE.address}`,
      expect.any(Object),
    );
  });
});

describe("resolveAbiFromContractApi", () => {
  afterEach(() => {
    fetchSpy.mockClear();
  });
  it.runIf(process.env.TW_SECRET_KEY)(
    "should resolve abi from contract api",
    async () => {
      // we do this so we don't hit any PRIOR cache
      const DOODLES_CONTRACT_CLONE = { ...DOODLES_CONTRACT };
      const abi = await resolveAbiFromBytecode(DOODLES_CONTRACT_CLONE);
      expect(abi).toMatchObject(DOODLES_ABI);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    },
  );
});
