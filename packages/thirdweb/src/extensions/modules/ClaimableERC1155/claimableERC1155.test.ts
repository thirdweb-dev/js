import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_ACCOUNT_C,
} from "../../../../test/src/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf } from "../../erc1155/__generated__/IERC1155/read/balanceOf.js";
import { getNFTs } from "../../erc1155/read/getNFTs.js";
import { getOwnedNFTs } from "../../erc1155/read/getOwnedNFTs.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import * as BatchMetadataERC1155 from "../BatchMetadataERC1155/index.js";
import * as ClaimableERC1155 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularClaimableERC1155", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      core: "ERC1155",
      modules: [
        ClaimableERC1155.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
        BatchMetadataERC1155.module(),
      ],
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestDropERC1155",
      },
    });
    contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  }, 120000);

  it("should have erc1155 module", async () => {
    const modules = await getInstalledModules({ contract });
    expect(modules.length).toBe(2);
  });

  it("should upload metadata", async () => {
    const transaction = BatchMetadataERC1155.uploadMetadata({
      contract,
      metadatas: Array.from(
        { length: 10 },
        (_, index) =>
          `ipfs://QmP4JFzBhTGvb27GnJ9eL9vZGYpNBGjHnPudWndruiNERm/${index}`,
      ),
    });

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction,
    });
  });

  it("should not claim without claim conditions", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: ClaimableERC1155.mint({
          contract,
          quantity: 1,
          to: TEST_ACCOUNT_A.address,
          tokenId: 123123123213n,
        }),
      }),
    ).rejects.toThrowError(/ClaimableOutOfTimeWindow/);
  });

  it("should claim tokens with claim conditions", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC1155.setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
        tokenId: 0n,
      }),
    });

    // should throw if claiming more than supply
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: ClaimableERC1155.mint({
          contract,
          quantity: 1000,
          to: TEST_ACCOUNT_A.address,
          tokenId: 0n,
        }),
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    let balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_A.address,
      tokenId: 0n,
    });

    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC1155.mint({
        contract,
        quantity: 1,
        to: TEST_ACCOUNT_A.address,
        tokenId: 0n,
      }),
    });

    balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_A.address,
      tokenId: 0n,
    });
    expect(balance).toBe(1n);

    const all = await getNFTs({
      contract,
    });
    expect(all.length).toBe(10);

    const owned = await getOwnedNFTs({
      address: TEST_ACCOUNT_A.address,
      contract,
    });
    expect(owned.length).toBe(1);
    expect(owned?.[0]?.metadata.name).toBe("Test 0");
    expect(owned?.[0]?.quantityOwned).toBe(1n);
  });

  it("should claim tokens with allowlist", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC1155.setClaimCondition({
        allowList: [TEST_ACCOUNT_A.address, TEST_ACCOUNT_B.address],
        contract,
        maxClaimableSupply: "2",
        pricePerToken: "0.1",
        tokenId: 0n,
      }),
    });

    // should throw if not in allowlist
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC1155.mint({
          contract,
          quantity: 1,
          to: TEST_ACCOUNT_C.address,
          tokenId: 0n,
        }),
      }),
    ).rejects.toThrowError(/ClaimableNotInAllowlist/);

    // should throw if in allowlist but over supply
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC1155.mint({
          contract,
          quantity: 3,
          to: TEST_ACCOUNT_C.address,
          tokenId: 0n,
        }),
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    // can claim to address in allowlist (regardless of sender)
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: ClaimableERC1155.mint({
        contract,
        quantity: 2,
        to: TEST_ACCOUNT_B.address,
        tokenId: 0n,
      }),
    });

    const balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_B.address,
      tokenId: 0n,
    });
    expect(balance).toBe(2n);
  });

  it("should claim tokens with max per wallet", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC1155.setClaimCondition({
        contract,
        maxClaimablePerWallet: 1,
        maxClaimableSupply: 10,
        tokenId: 0n,
      }),
    });

    let balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_C.address,
      tokenId: 0n,
    });
    expect(balance).toBe(0n);

    // should throw if max per wallet is reached
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC1155.mint({
          contract,
          quantity: 4,
          to: TEST_ACCOUNT_C.address,
          tokenId: 0n,
        }),
      }),
    ).rejects.toThrowError(/ClaimableMaxMintPerWalletExceeded/);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: ClaimableERC1155.mint({
        contract,
        quantity: 1,
        to: TEST_ACCOUNT_C.address,
        tokenId: 0n,
      }),
    });

    balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_C.address,
      tokenId: 0n,
    });
    expect(balance).toBe(1n);
  });
});
