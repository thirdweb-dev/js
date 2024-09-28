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
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf } from "../../erc1155/__generated__/IERC1155/read/balanceOf.js";
import { getNFTs } from "../../erc1155/read/getNFTs.js";
import { getOwnedNFTs } from "../../erc1155/read/getOwnedNFTs.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import * as BatchMetadataERC1155 from "../BatchMetadataERC1155/index.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import * as ClaimableERC1155 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularClaimableERC1155", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      core: "ERC1155",
      params: {
        name: "TestDropERC1155",
        contractURI: TEST_CONTRACT_URI,
      },
      modules: [
        ClaimableERC1155.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
        BatchMetadataERC1155.module(),
      ],
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
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
      transaction,
      account: TEST_ACCOUNT_A,
    });
  });

  it("should not claim without claim conditions", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC1155.mint({
          contract,
          tokenId: 123123123213n,
          quantity: 1,
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/ClaimableOutOfTimeWindow/);
  });

  it("should claim tokens with claim conditions", async () => {
    await sendAndConfirmTransaction({
      transaction: ClaimableERC1155.setClaimCondition({
        contract,
        tokenId: 0n,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if claiming more than supply
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC1155.mint({
          contract,
          tokenId: 0n,
          quantity: 1000,
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    let balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
      tokenId: 0n,
    });

    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: ClaimableERC1155.mint({
        contract,
        tokenId: 0n,
        quantity: 1,
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
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
      transaction: ClaimableERC1155.setClaimCondition({
        contract,
        tokenId: 0n,
        maxClaimableSupply: "2",
        pricePerToken: "0.1",
        allowList: [TEST_ACCOUNT_A.address, TEST_ACCOUNT_B.address],
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if not in allowlist
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC1155.mint({
          contract,
          tokenId: 0n,
          quantity: 1,
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableNotInAllowlist/);

    // should throw if in allowlist but over supply
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC1155.mint({
          contract,
          tokenId: 0n,
          quantity: 3,
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    // can claim to address in allowlist (regardless of sender)
    await sendAndConfirmTransaction({
      transaction: ClaimableERC1155.mint({
        contract,
        tokenId: 0n,
        quantity: 2,
        to: TEST_ACCOUNT_B.address,
      }),
      account: TEST_ACCOUNT_C,
    });

    const balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
      tokenId: 0n,
    });
    expect(balance).toBe(2n);
  });

  it("should claim tokens with max per wallet", async () => {
    await sendAndConfirmTransaction({
      transaction: ClaimableERC1155.setClaimCondition({
        contract,
        tokenId: 0n,
        maxClaimableSupply: 10,
        maxClaimablePerWallet: 1,
      }),
      account: TEST_ACCOUNT_A,
    });

    let balance = await balanceOf({
      owner: TEST_ACCOUNT_C.address,
      contract,
      tokenId: 0n,
    });
    expect(balance).toBe(0n);

    // should throw if max per wallet is reached
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC1155.mint({
          contract,
          tokenId: 0n,
          quantity: 4,
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableMaxMintPerWalletExceeded/);

    await sendAndConfirmTransaction({
      transaction: ClaimableERC1155.mint({
        contract,
        tokenId: 0n,
        quantity: 1,
        to: TEST_ACCOUNT_C.address,
      }),
      account: TEST_ACCOUNT_C,
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_C.address,
      contract,
      tokenId: 0n,
    });
    expect(balance).toBe(1n);
  });
});
