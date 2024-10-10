import { type Abi, toFunctionSelector } from "viem";
import { describe, expect, it } from "vitest";
import {
  BASE_USDC_PROXY_CONTRACT,
  DOODLES_CONTRACT,
  USDT_CONTRACT,
} from "~test/test-contracts.js";
import { resolveContractAbi } from "../../../contract/actions/resolve-abi.js";
import { isERC20 } from "./isERC20.js";

describe.runIf(process.env.TW_SECRET_KEY)("isERC20", () => {
  it("should detect USDT as a valid erc20 contract", async () => {
    const abi = await resolveContractAbi<Abi>(USDT_CONTRACT);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isERC20(selectors)).toBe(true);
  });

  it("should detect USDC as a valid erc20 contract", async () => {
    const abi = await resolveContractAbi<Abi>(BASE_USDC_PROXY_CONTRACT);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isERC20(selectors)).toBe(true);
  });

  it("should NOT detect any NFT contract as a valid erc20 contract", async () => {
    const abi = await resolveContractAbi<Abi>(DOODLES_CONTRACT);
    const selectors = abi
      .filter((f) => f.type === "function")
      .map((f) => toFunctionSelector(f));
    expect(isERC20(selectors)).toBe(false);
  });
});
