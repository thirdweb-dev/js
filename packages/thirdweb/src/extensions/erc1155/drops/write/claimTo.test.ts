import { beforeEach, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";

import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { deployERC1155Contract } from "../../../../extensions/prebuilts/deploy-erc1155.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { totalSupply } from "../../__generated__/IERC1155/read/totalSupply.js";
import { lazyMint } from "../../write/lazyMint.js";
import { claimTo } from "./claimTo.js";
import { setClaimConditions } from "./setClaimConditions.js";

let contract: ThirdwebContract;
const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("erc1155 claimTo extension", () => {
  beforeEach(async () => {
    const address = await deployERC1155Contract({
      client,
      chain,
      account,
      type: "DropERC1155",
      params: {
        name: "Edition Drop",
      },
    });
    contract = getContract({
      address,
      client,
      chain,
    });

    const transaction = lazyMint({ contract, nfts: [{ name: "token 0" }] });
    await sendAndConfirmTransaction({ transaction, account });

    const setClaimTx = setClaimConditions({
      contract,
      tokenId: 0n,
      phases: [
        {
          maxClaimableSupply: 100n,
          maxClaimablePerWallet: 100n,
          currencyAddress: NATIVE_TOKEN_ADDRESS,
          price: 0.1,
          startTime: new Date(),
        },
      ],
    });

    await sendAndConfirmTransaction({ transaction: setClaimTx, account });
  });

  it("should claim the nft", async () => {
    const transaction = claimTo({
      contract,
      tokenId: 0n,
      quantity: 1n,
      to: account.address,
    });

    await sendAndConfirmTransaction({ transaction, account });

    const supplyCount = await totalSupply({ contract, id: 0n });
    expect(supplyCount).toBe(1n);
  });
});
