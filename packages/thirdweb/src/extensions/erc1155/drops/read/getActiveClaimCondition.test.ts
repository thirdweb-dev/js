import { describe, expect, it } from "vitest";

import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { MAX_UINT256 } from "~test/test-consts.js";
import { TEST_ACCOUNT_B } from "~test/test-wallets.js";
import { DROP1155_CONTRACT } from "../../../../../test/src/test-contracts.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { getContract } from "../../../../contract/contract.js";
import { generateMerkleTreeInfoERC1155 } from "../../../../extensions/airdrop/write/merkleInfoERC1155.js";
import { deployERC1155Contract } from "../../../../extensions/prebuilts/deploy-erc1155.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { lazyMint } from "../../write/lazyMint.js";
import { setClaimConditions } from "../write/setClaimConditions.js";
import { getActiveClaimCondition } from "./getActiveClaimCondition.js";

const account = TEST_ACCOUNT_B;

describe.runIf(process.env.TW_SECRET_KEY)("erc1155.getClaimConditions", () => {
  it("should return the correct claim conditions", async () => {
    const cc = await getActiveClaimCondition({
      contract: DROP1155_CONTRACT,
      tokenId: 4n,
    });
    expect(cc).toEqual({
      currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      maxClaimableSupply: MAX_UINT256,
      merkleRoot:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      metadata: "ipfs://QmVu98eczZRpSYcF3UKYRDkHsM2RMQR62KUYmk29UDbWTP/0",
      pricePerToken: 438030000000000n,
      quantityLimitPerWallet: MAX_UINT256,
      startTimestamp: 1701814725n,
      supplyClaimed: 1382n,
    });
    // 1 call for the condition id and 1 call for the condition
  });

  it("should return the correct claim condition for the public allowlist claim phase", async () => {
    const address = await deployERC1155Contract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account,
      type: "DropERC1155",
      params: {
        name: "EditionDrop",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    // Upload an NFT
    const lzMint = lazyMint({ contract, nfts: [{ name: "token #0" }] });
    await sendAndConfirmTransaction({
      transaction: lzMint,
      account,
    });

    // Create a public allowlist claim phase
    const snapshot = [
      {
        recipient: "0x12345674b599ce99958242b3D3741e7b01841DF3",
        tokenId: 0,
        amount: 5,
      },
      {
        recipient: "0x89f84D4e4ecaBa42233EEfc46eE49a03Db943bAD",
        tokenId: 0,
        amount: 5,
      },
    ];

    const { merkleRoot } = await generateMerkleTreeInfoERC1155({
      contract,
      tokenAddress: NATIVE_TOKEN_ADDRESS,
      snapshot,
    });

    const startTime = new Date();
    const setCC = setClaimConditions({
      contract,
      tokenId: 0n,
      phases: [
        {
          maxClaimableSupply: 100n,
          maxClaimablePerWallet: 5n,
          currencyAddress: NATIVE_TOKEN_ADDRESS,
          price: 0.006,
          startTime,
          merkleRootHash: merkleRoot,
        },
      ],
    });

    await sendAndConfirmTransaction({
      transaction: setCC,
      account,
    });

    const activeCC = await getActiveClaimCondition({ contract, tokenId: 0n });
    expect(activeCC.currency.toLowerCase()).toBe(
      NATIVE_TOKEN_ADDRESS.toLowerCase(),
    );
    expect(activeCC.merkleRoot).toBe(
      "0xbfa52e7f255395704d8ea7174ec56f1357e6a1946753fcd64000adb4aeb3ca4a",
    );
    expect(activeCC.pricePerToken).toBe(6000000000000000n);
    expect(activeCC.quantityLimitPerWallet).toBe(5n);
  });
});
