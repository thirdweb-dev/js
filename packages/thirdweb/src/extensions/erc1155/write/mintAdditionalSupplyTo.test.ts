import { type Abi, toFunctionSelector } from "viem";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { resolveContractAbi } from "../../../contract/actions/resolve-abi.js";
import { getContract } from "../../../contract/contract.js";
import { deployERC1155Contract } from "../../../extensions/prebuilts/deploy-erc1155.js";
import { isMintAdditionalSupplyToSupported } from "./mintAdditionalSupplyTo.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "erc1155: mintAdditionalSupplyTo",
  () => {
    it("`isMintAdditionalSupplyToSupported` should work with our Edition contracts", async () => {
      const contract = getContract({
        address: await deployERC1155Contract({
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          params: {
            name: "",
            contractURI: TEST_CONTRACT_URI,
          },
          type: "TokenERC1155",
          account: TEST_ACCOUNT_C,
        }),
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });

      const abi = await resolveContractAbi<Abi>(contract);
      const selectors = abi
        .filter((f) => f.type === "function")
        .map((f) => toFunctionSelector(f));
      expect(isMintAdditionalSupplyToSupported(selectors)).toBe(true);
    });
  },
);
