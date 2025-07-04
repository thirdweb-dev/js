import { keccak256 } from "viem";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { codehashVersion } from "../__generated__/IArbWasm/read/codehashVersion.js";
import { ARB_WASM_ADDRESS } from "./activateStylusContract.js";

export type IsContractActivatedOptions = {
  chain: Chain;
  client: ThirdwebClient;
  bytecode: `0x${string}`;
};

export async function isContractActivated(
  options: IsContractActivatedOptions,
): Promise<boolean> {
  const { chain, client, bytecode } = options;
  const arbWasmPrecompile = getContract({
    address: ARB_WASM_ADDRESS,
    chain,
    client,
  });

  try {
    await codehashVersion({
      codehash: keccak256(extractRuntimeBytecode(bytecode)),
      contract: arbWasmPrecompile,
    });
    return true;
  } catch {
    return false;
  }
}

function extractRuntimeBytecode(deployInput: string | Uint8Array): Uint8Array {
  // normalise input
  const deploy: Uint8Array =
    typeof deployInput === "string" ? hexToBytes(deployInput) : deployInput;

  // the contract_deployment_calldata helper emits 42-byte prelude + 1-byte version  =>  43 bytes total
  // ref: https://github.com/OffchainLabs/cargo-stylus/blob/main/main/src/deploy/mod.rs#L305
  const PRELUDE_LEN = 42;
  const TOTAL_FIXED = PRELUDE_LEN + 1; // +1 version byte

  if (deploy.length < TOTAL_FIXED) {
    throw new Error("Deployment bytecode too short");
  }
  if (deploy[0] !== 0x7f) {
    throw new Error(
      "Missing 0x7f PUSH32 - not produced by contract_deployment_calldata",
    );
  }

  // read length
  const codeLenBytes = deploy.slice(1, 33);
  let codeLen = 0n;
  for (const b of codeLenBytes) codeLen = (codeLen << 8n) | BigInt(b);

  if (codeLen > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Runtime code length exceeds JS safe integer range");
  }

  // pattern sanity-check
  const EXPECTED = [
    0x80, // DUP1
    0x60,
    0x2b, // PUSH1 0x2b (42 + 1)
    0x60,
    0x00, // PUSH1 0
    0x39, // CODECOPY
    0x60,
    0x00, // PUSH1 0
    0xf3, // RETURN
    0x00, // version
  ] as const;
  for (let i = 0; i < EXPECTED.length; i++) {
    if (deploy[33 + i] !== EXPECTED[i]) {
      throw new Error("Prelude bytes do not match expected pattern");
    }
  }

  // slice out runtime code
  const start = TOTAL_FIXED;
  const end = start + Number(codeLen);
  if (deploy.length < end) {
    throw new Error("Deployment bytecode truncated - runtime code incomplete");
  }

  return deploy.slice(start, end);
}

function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (normalized.length % 2 !== 0) {
    throw new Error("Hex string must have an even length");
  }
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
