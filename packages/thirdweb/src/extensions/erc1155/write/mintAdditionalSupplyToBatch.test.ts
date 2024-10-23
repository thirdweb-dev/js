import { type Abi, toFunctionSelector } from "viem";
import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_C } from "~test/test-wallets.js";
import { resolveContractAbi } from "../../../contract/actions/resolve-abi.js";
import { getContract } from "../../../contract/contract.js";
import { deployERC1155Contract } from "../../../extensions/prebuilts/deploy-erc1155.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getNFTs } from "../read/getNFTs.js";
import { isMintAdditionalSupplyToSupported } from "./mintAdditionalSupplyTo.js";
import {
  mintAdditionalSupplyToBatch,
  optimizeMintBatchContent,
} from "./mintAdditionalSupplyToBatch.js";
import { mintToBatch } from "./mintToBatch.js";

const chain = ANVIL_CHAIN;
const client = TEST_CLIENT;
const account = TEST_ACCOUNT_C;

describe.runIf(process.env.TW_SECRET_KEY)(
  "ERC1155 Edition: mintToBatch",
  () => {
    it("should optimize the mint content", () => {
      expect(
        optimizeMintBatchContent([
          { tokenId: 0n, supply: 99n, to: account.address },
          { tokenId: 1n, supply: 49n, to: account.address },
          { tokenId: 1n, supply: 51n, to: account.address },
        ]),
      ).toStrictEqual([
        { tokenId: 0n, supply: 99n, to: account.address },
        { tokenId: 1n, supply: 100n, to: account.address },
      ]);
    });

    it("should mint multiple tokens in one tx", async () => {
      const contract = getContract({
        chain,
        client,
        address: await deployERC1155Contract({
          chain,
          client,
          account,
          type: "TokenERC1155",
          params: {
            name: "edition",
            contractURI: TEST_CONTRACT_URI,
          },
        }),
      });

      // `isMintAdditionalSupplyToSupported` should work with our Edition contracts
      const abi = await resolveContractAbi<Abi>(contract);
      const selectors = abi
        .filter((f) => f.type === "function")
        .map((f) => toFunctionSelector(f));
      expect(isMintAdditionalSupplyToSupported(selectors)).toBe(true);

      await sendAndConfirmTransaction({
        account,
        transaction: mintToBatch({
          contract,
          to: account.address,
          nfts: [
            { metadata: { name: "token 0" }, supply: 1n },
            { metadata: { name: "token 1" }, supply: 2n },
            { metadata: { name: "token 2" }, supply: 3n },
          ],
        }),
      });

      await sendAndConfirmTransaction({
        account,
        transaction: mintAdditionalSupplyToBatch({
          contract,
          nfts: [
            { tokenId: 0n, supply: 99n, to: account.address },
            { tokenId: 1n, supply: 94n, to: account.address },
            { tokenId: 2n, supply: 97n, to: account.address },
            { tokenId: 1n, supply: 4n, to: account.address },
          ],
        }),
      });

      const nfts = await getNFTs({ contract });
      expect(nfts).toStrictEqual([
        {
          metadata: { name: "token 0" },
          owner: null,
          id: 0n,
          tokenURI: "ipfs://QmPZ6LpGqMuFbHKTXrNW1NRNLHf1nrxS4dtoFqdZZTKvPX/0",
          type: "ERC1155",
          supply: 100n,
        },
        {
          metadata: { name: "token 1" },
          owner: null,
          id: 1n,
          tokenURI: "ipfs://QmRFPyc3yEYxR4pQxwyTQWTine51TxWCoD6nzJWR3eX45b/0",
          type: "ERC1155",
          supply: 100n,
        },
        {
          metadata: { name: "token 2" },
          owner: null,
          id: 2n,
          tokenURI: "ipfs://QmesQiRLHCgqWZM2GFCs7Nb7rr2S72hU1BVQc7xiTyKZtT/0",
          type: "ERC1155",
          supply: 100n,
        },
      ]);
    });
  },
);
