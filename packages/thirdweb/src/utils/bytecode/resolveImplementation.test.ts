import type { AbiConstructor } from "abitype";
import { describe, expect, it } from "vitest";
import {
  DUMMY_BYTECODE,
  ERC1967_PROXY_BYTECODE,
  ERC1967_PROXY_CONSTRUCTOR_ABI,
} from "../../../test/src/abis/proxy.js";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  NFT_DROP_CONTRACT,
  NFT_DROP_IMPLEMENTATION,
} from "../../../test/src/test-contracts.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { deployContract } from "../../contract/deployment/deploy-with-abi.js";
import { resolveImplementation } from "./resolveImplementation.js";

describe("Resolve implementation", async () => {
  it("should extract implementation address for minimal proxy contract", async () => {
    const resolved = resolveImplementation(NFT_DROP_CONTRACT);
    expect((await resolved).address).to.equal(NFT_DROP_IMPLEMENTATION);
  });

  it("should extract implementation address for ERC1967 proxy contract", async () => {
    const implementationAddress = await deployContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      bytecode: DUMMY_BYTECODE,
      constructorAbi: {} as AbiConstructor,
      constructorParams: [],
    });

    const proxyAddress = await deployContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      bytecode: ERC1967_PROXY_BYTECODE,
      constructorAbi: ERC1967_PROXY_CONSTRUCTOR_ABI as AbiConstructor,
      constructorParams: [implementationAddress, ""],
    });

    const proxy = getContract({
      chain: ANVIL_CHAIN,
      address: proxyAddress,
      client: TEST_CLIENT,
    });

    const resolved = await resolveImplementation(proxy);
    expect(resolved.address).to.equal(implementationAddress);
  });
});
