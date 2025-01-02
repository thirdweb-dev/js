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
import { balanceOf } from "../../erc721/__generated__/IERC721A/read/balanceOf.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import * as BatchMetadataERC721 from "../BatchMetadataERC721/index.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import * as ClaimableERC721 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularClaimableERC721", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      core: "ERC721",
      params: {
        name: "TestDropERC721",
        contractURI: TEST_CONTRACT_URI,
      },
      modules: [
        ClaimableERC721.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
        BatchMetadataERC721.module(),
      ],
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
    });
  }, 120000);

  it("should have erc721 module", async () => {
    const modules = await getInstalledModules({ contract });
    expect(modules.length).toBe(2);
  });

  it("should upload metadata", async () => {
    const transaction = BatchMetadataERC721.uploadMetadata({
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
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 1,
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/ClaimableOutOfTimeWindow/);
  });

  it("should claim tokens with claim conditions", async () => {
    await sendAndConfirmTransaction({
      transaction: ClaimableERC721.setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if claiming more than supply
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 1000,
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    let balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
    });

    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: ClaimableERC721.mint({
        contract,
        quantity: 1,
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
    });
    expect(balance).toBe(1n);
  });

  it("should claim tokens with allowlist", async () => {
    await sendAndConfirmTransaction({
      transaction: ClaimableERC721.setClaimCondition({
        contract,
        maxClaimableSupply: "2",
        pricePerToken: "0.1",
        allowList: [TEST_ACCOUNT_A.address, TEST_ACCOUNT_B.address],
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if not in allowlist
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 1,
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableNotInAllowlist/);

    // should throw if in allowlist but over supply
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 3,
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    // can claim to address in allowlist (regardless of sender)
    await sendAndConfirmTransaction({
      transaction: ClaimableERC721.mint({
        contract,
        quantity: 2,
        to: TEST_ACCOUNT_B.address,
      }),
      account: TEST_ACCOUNT_C,
    });

    const balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
    });
    expect(balance).toBe(2n);
  });

  it("should claim tokens with max per wallet", async () => {
    await sendAndConfirmTransaction({
      transaction: ClaimableERC721.setClaimCondition({
        contract,
        maxClaimableSupply: 10,
        maxClaimablePerWallet: 1,
      }),
      account: TEST_ACCOUNT_A,
    });

    // should throw if max per wallet is reached
    await expect(
      sendAndConfirmTransaction({
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 4,
          to: TEST_ACCOUNT_C.address,
        }),
        account: TEST_ACCOUNT_C,
      }),
    ).rejects.toThrowError(/ClaimableMaxMintPerWalletExceeded/);

    await sendAndConfirmTransaction({
      transaction: ClaimableERC721.mint({
        contract,
        quantity: 1,
        to: TEST_ACCOUNT_C.address,
      }),
      account: TEST_ACCOUNT_C,
    });

    const balance = await balanceOf({
      owner: TEST_ACCOUNT_C.address,
      contract,
    });
    expect(balance).toBe(1n);
  });
});
