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
import { balanceOf } from "../../erc721/__generated__/IERC721A/read/balanceOf.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import * as BatchMetadataERC721 from "../BatchMetadataERC721/index.js";
import * as ClaimableERC721 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularClaimableERC721", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      core: "ERC721",
      modules: [
        ClaimableERC721.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
        BatchMetadataERC721.module(),
      ],
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestDropERC721",
      },
    });
    contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
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
      account: TEST_ACCOUNT_A,
      transaction,
    });
  });

  it("should not claim without claim conditions", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 1,
          to: TEST_ACCOUNT_A.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableOutOfTimeWindow/);
  });

  it("should claim tokens with claim conditions", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC721.setClaimCondition({
        contract,
        maxClaimableSupply: "1",
        pricePerToken: "0.1",
      }),
    });

    // should throw if claiming more than supply
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 1000,
          to: TEST_ACCOUNT_A.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    let balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_A.address,
    });

    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC721.mint({
        contract,
        quantity: 1,
        to: TEST_ACCOUNT_A.address,
      }),
    });

    balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_A.address,
    });
    expect(balance).toBe(1n);
  });

  it("should claim tokens with allowlist", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC721.setClaimCondition({
        allowList: [TEST_ACCOUNT_A.address, TEST_ACCOUNT_B.address],
        contract,
        maxClaimableSupply: "2",
        pricePerToken: "0.1",
      }),
    });

    // should throw if not in allowlist
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 1,
          to: TEST_ACCOUNT_C.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableNotInAllowlist/);

    // should throw if in allowlist but over supply
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 3,
          to: TEST_ACCOUNT_C.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableOutOfSupply/);

    // can claim to address in allowlist (regardless of sender)
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: ClaimableERC721.mint({
        contract,
        quantity: 2,
        to: TEST_ACCOUNT_B.address,
      }),
    });

    const balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_B.address,
    });
    expect(balance).toBe(2n);
  });

  it("should claim tokens with max per wallet", async () => {
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: ClaimableERC721.setClaimCondition({
        contract,
        maxClaimablePerWallet: 1,
        maxClaimableSupply: 10,
      }),
    });

    // should throw if max per wallet is reached
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_C,
        transaction: ClaimableERC721.mint({
          contract,
          quantity: 4,
          to: TEST_ACCOUNT_C.address,
        }),
      }),
    ).rejects.toThrowError(/ClaimableMaxMintPerWalletExceeded/);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_C,
      transaction: ClaimableERC721.mint({
        contract,
        quantity: 1,
        to: TEST_ACCOUNT_C.address,
      }),
    });

    const balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_C.address,
    });
    expect(balance).toBe(1n);
  });
});
