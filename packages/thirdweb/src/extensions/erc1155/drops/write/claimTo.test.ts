import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A, TEST_ACCOUNT_B } from "~test/test-wallets.js";

import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { getContract } from "../../../../contract/contract.js";
import { deployERC20Contract } from "../../../../extensions/prebuilts/deploy-erc20.js";
import { deployERC1155Contract } from "../../../../extensions/prebuilts/deploy-erc1155.js";
import { sendAndConfirmTransaction } from "../../../../transaction/actions/send-and-confirm-transaction.js";
import { totalSupply } from "../../__generated__/IERC1155/read/totalSupply.js";
import { lazyMint } from "../../write/lazyMint.js";
import { claimTo } from "./claimTo.js";
import { setClaimConditions } from "./setClaimConditions.js";

const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

describe.runIf(process.env.TW_SECRET_KEY)("erc1155 claimTo extension", () => {
  it("should claim the nft", async () => {
    const address = await deployERC1155Contract({
      client,
      chain,
      account,
      type: "DropERC1155",
      params: {
        name: "Edition Drop",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({
      address,
      client,
      chain,
    });
    const lazyMintTx = lazyMint({ contract, nfts: [{ name: "token 0" }] });
    await sendAndConfirmTransaction({ transaction: lazyMintTx, account });
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

  it("should claim with allowlist", async () => {
    const address = await deployERC1155Contract({
      client,
      chain,
      account,
      type: "DropERC1155",
      params: {
        name: "Edition Drop",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({
      address,
      client,
      chain,
    });
    const lazyMintTx = lazyMint({ contract, nfts: [{ name: "token 0" }] });
    await sendAndConfirmTransaction({ transaction: lazyMintTx, account });
    const setClaimTx = setClaimConditions({
      contract,
      tokenId: 0n,
      phases: [
        {
          maxClaimableSupply: 100n,
          maxClaimablePerWallet: 5n,
          currencyAddress: NATIVE_TOKEN_ADDRESS,
          price: 0.06,
          startTime: new Date(),
          overrideList: [
            {
              address: TEST_ACCOUNT_B.address,
              maxClaimable: "50",
              price: "0.3",
              currencyAddress: NATIVE_TOKEN_ADDRESS,
            },
          ],
        },
      ],
    });
    await sendAndConfirmTransaction({ transaction: setClaimTx, account });

    const transaction = claimTo({
      contract,
      tokenId: 0n,
      quantity: 50n,
      to: TEST_ACCOUNT_B.address,
    });
    await sendAndConfirmTransaction({ transaction, account: TEST_ACCOUNT_B });
    const supplyCount = await totalSupply({ contract, id: 0n });
    expect(supplyCount).toBe(50n);
  });

  /**
   * This is to document the behavior where one can claim without paying if the claiming address
   * is the same as the PrimaryRecipientAddress, because of this Solidity code:
   * ```solidity
   * // CurrencyTransferLib.sol
   * function safeTransferERC20(address _currency, address _from, address _to, uint256 _amount) internal {
   *   if (_from == _to) {
   *     return;
   *   }
   *   ...
   * }
   * ```
   */
  it("address that is the same with PrimaryFeeRecipient can claim without paying ERC20", async () => {
    const tokenAddress = await deployERC20Contract({
      client,
      chain,
      account,
      type: "TokenERC20",
      params: {
        name: "token20",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const address = await deployERC1155Contract({
      client,
      chain,
      account,
      type: "DropERC1155",
      params: {
        name: "Edition Drop",
        contractURI: TEST_CONTRACT_URI,
        saleRecipient: account.address,
      },
    });
    const contract = getContract({
      address,
      client,
      chain,
    });
    const lazyMintTx = lazyMint({ contract, nfts: [{ name: "token 0" }] });
    await sendAndConfirmTransaction({ transaction: lazyMintTx, account });
    const setClaimTx = setClaimConditions({
      contract,
      tokenId: 0n,
      phases: [
        {
          maxClaimableSupply: 100n,
          maxClaimablePerWallet: 100n,
          currencyAddress: tokenAddress,
          price: 1000,
          startTime: new Date(),
        },
      ],
    });
    await sendAndConfirmTransaction({ transaction: setClaimTx, account });

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
