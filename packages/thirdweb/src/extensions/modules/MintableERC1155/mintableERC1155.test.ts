import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { getAddress } from "../../../utils/address.js";
import { balanceOf } from "../../erc1155/__generated__/IERC1155/read/balanceOf.js";
import { getNFTs } from "../../erc1155/read/getNFTs.js";
import { getOwnedNFTs } from "../../erc1155/read/getOwnedNFTs.js";
import * as BatchMetadataERC1155 from "../../modules/BatchMetadataERC1155/index.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import * as SequentialTokenIdERC1155 from "../SequentialTokenIdERC1155/index.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import { grantMinterRole } from "../common/grantMinterRole.js";
import * as MintableERC1155 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularTokenERC1155", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      account: TEST_ACCOUNT_A,
      core: "ERC1155",
      params: {
        name: "TestTokenERC1155",
        symbol: "TT",
        contractURI: TEST_CONTRACT_URI,
      },
      modules: [
        MintableERC1155.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
        BatchMetadataERC1155.module(),
        SequentialTokenIdERC1155.module({
          startTokenId: 0n,
        }),
      ],
    });
    contract = getContract({
      client: TEST_CLIENT,
      chain: ANVIL_CHAIN,
      address,
    });
  }, 11155000);

  it("should have erc1155 module", async () => {
    const modules = await getInstalledModules({ contract });
    expect(modules.length).toBe(3);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        transaction: MintableERC1155.mintWithRole({
          contract,
          nft: "ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a",
          amount: 10n,
          to: TEST_ACCOUNT_A.address,
        }),
        account: TEST_ACCOUNT_A,
      }),
    ).rejects.toThrowError(/MintableRequestUnauthorized/);
  });

  it("should mint tokens with permissions", async () => {
    let balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      tokenId: 0n,
      contract,
    });
    expect(balance).toBe(0n);

    // grant minter role
    await sendAndConfirmTransaction({
      transaction: grantMinterRole({
        contract,
        user: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    // mint
    await sendAndConfirmTransaction({
      transaction: MintableERC1155.mintWithRole({
        contract,
        nft: "ipfs://Qmah4ePps7cKPVydfrSme3NkiAfrWM8jSmirsKwyZCaQm4/0",
        amount: 10n,
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
      tokenId: 0n,
    });

    expect(balance).toBe(10n);

    const nfts = await getNFTs({ contract });
    expect(nfts.length).toBe(1);
    expect(nfts?.[0]?.metadata.name).toBe("Test");

    const owned = await getOwnedNFTs({
      address: TEST_ACCOUNT_A.address,
      contract,
    });
    expect(owned.length).toBe(1);
    expect(owned?.[0]?.metadata.name).toBe("Test");
  });

  it("should mint tokens with a signature", async () => {
    const result = await MintableERC1155.generateMintSignature({
      account: TEST_ACCOUNT_A,
      contract,
      nft: "ipfs://Qmah4ePps7cKPVydfrSme3NkiAfrWM8jSmirsKwyZCaQm4/0",
      mintRequest: {
        recipient: getAddress(TEST_ACCOUNT_B.address),
        quantity: 10n,
      },
    });

    let balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
      tokenId: 1n,
    });
    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      transaction: MintableERC1155.mintWithSignature({
        contract,
        ...result,
      }),
      account: TEST_ACCOUNT_B, // diff account can mint
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_B.address,
      contract,
      tokenId: 1n,
    });
    expect(balance).toBe(10n);
  });

  it.skip("should mint additional supply of tokens with permissions", async () => {
    let balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      tokenId: 0n,
      contract,
    });
    expect(balance).toBe(10n);

    // mint
    await sendAndConfirmTransaction({
      transaction: MintableERC1155.mintWithRole({
        contract,
        nft: "ipfs://Qmah4ePps7cKPVydfrSme3NkiAfrWM8jSmirsKwyZCaQm4/0",
        amount: 5n,
        tokenId: 0n,
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    balance = await balanceOf({
      owner: TEST_ACCOUNT_A.address,
      contract,
      tokenId: 0n,
    });

    expect(balance).toBe(15n);
  });
});
