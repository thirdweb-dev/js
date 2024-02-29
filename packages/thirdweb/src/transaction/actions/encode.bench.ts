import { bench } from "vitest";
import { prepareContractCall } from "../prepare-contract-call.js";
import {
  USDC_CONTRACT,
  USDC_CONTRACT_WITH_ABI,
} from "../../../test/src/test-contracts.js";
import { VITALIK_WALLET } from "../../../test/src/addresses.js";
import { encode } from "./encode.js";
import { resolveMethod } from "../resolve-method.js";
import { prepareMethod } from "../../utils/abi/prepare-method.js";

bench("encode tx (human readable)", async () => {
  const tx = prepareContractCall({
    contract: { ...USDC_CONTRACT },
    method: "function transfer(address,uint256)",
    params: [VITALIK_WALLET, 100n],
  });
  await encode(tx);
});

bench("encode tx (json abi)", async () => {
  const tx = prepareContractCall({
    contract: { ...USDC_CONTRACT },
    method: {
      name: "transfer",
      type: "function",
      inputs: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
      ],
      outputs: [],
      stateMutability: "payable",
    },
    params: [VITALIK_WALLET, 100n],
  });
  await encode(tx);
});

bench("encode tx (contract abi)", async () => {
  const tx = prepareContractCall({
    contract: { ...USDC_CONTRACT_WITH_ABI },
    method: "transfer",
    params: [VITALIK_WALLET, 100n],
  });
  await encode(tx);
});

bench("encode tx (auto-abi)", async () => {
  const tx = prepareContractCall({
    // fresh contract every time otherwise we'll just hit cache
    contract: { ...USDC_CONTRACT },
    method: resolveMethod("transfer"),
    params: [VITALIK_WALLET, 100n],
  });
  await encode(tx);
});

bench("encode tx (prepared method)", async () => {
  const tx = prepareContractCall({
    contract: { ...USDC_CONTRACT },
    method: prepareMethod("function transfer(address,uint256)"),
    params: [VITALIK_WALLET, 100n],
  });
  await encode(tx);
});
