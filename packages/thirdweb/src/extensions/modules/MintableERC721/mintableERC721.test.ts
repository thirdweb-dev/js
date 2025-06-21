import { beforeAll, describe, expect, it } from "vitest";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../test/src/test-wallets.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { balanceOf } from "../../erc721/__generated__/IERC721A/read/balanceOf.js";
import { tokenURI } from "../../erc721/__generated__/IERC721A/read/tokenURI.js";
import { getNFT } from "../../erc721/read/getNFT.js";
import { getNFTs } from "../../erc721/read/getNFTs.js";
import * as BatchMetadataERC721 from "../../modules/BatchMetadataERC721/index.js";
import { deployModularContract } from "../../prebuilts/deploy-modular.js";
import { getInstalledModules } from "../__generated__/IModularCore/read/getInstalledModules.js";
import { grantMinterRole } from "../common/grantMinterRole.js";
import * as MintableERC721 from "./index.js";

describe.runIf(process.env.TW_SECRET_KEY)("ModularTokenERC721", () => {
  let contract: ThirdwebContract;
  beforeAll(async () => {
    const address = await deployModularContract({
      account: TEST_ACCOUNT_A,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
      core: "ERC721",
      modules: [
        MintableERC721.module({
          primarySaleRecipient: TEST_ACCOUNT_A.address,
        }),
        BatchMetadataERC721.module(),
      ],
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "TestTokenERC721",
        symbol: "TT",
      },
    });
    contract = getContract({
      address,
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  }, 1721000);

  it("should have erc721 module", async () => {
    const modules = await getInstalledModules({ contract });
    expect(modules.length).toBe(2);
  });

  it("should not mint without signature", async () => {
    // should throw
    await expect(
      sendAndConfirmTransaction({
        account: TEST_ACCOUNT_A,
        transaction: MintableERC721.mintWithRole({
          contract,
          nfts: ["ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a"],
          to: TEST_ACCOUNT_A.address,
        }),
      }),
    ).rejects.toThrowError(/MintableRequestUnauthorized/);
  });

  it("should mint tokens with permissions", async () => {
    let balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_A.address,
    });
    expect(balance).toBe(0n);

    // grant minter role
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: grantMinterRole({
        contract,
        user: TEST_ACCOUNT_A.address,
      }),
    });

    // mint
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: MintableERC721.mintWithRole({
        contract,
        nfts: ["ipfs://Qmah4ePps7cKPVydfrSme3NkiAfrWM8jSmirsKwyZCaQm4/0"],
        to: TEST_ACCOUNT_A.address,
      }),
    });

    balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_A.address,
    });

    expect(balance).toBe(1n);

    const nfts = await getNFTs({ contract });
    expect(nfts.length).toBe(1);
    expect(nfts?.[0]?.metadata.name).toBe("Test");

    const nft = await getNFT({
      contract,
      tokenId: 0n,
    });
    expect(nft.metadata.name).toBe("Test");
  });

  it("should mint tokens with a signature", async () => {
    const result = await MintableERC721.generateMintSignature({
      account: TEST_ACCOUNT_A,
      contract,
      mintRequest: {
        recipient: TEST_ACCOUNT_B.address,
      },
      nfts: ["ipfs://Qma4g1c8e9c7a6a4c5a1a5c1a3a2a4a5a6a7a8a9a0a"],
    });

    let balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_B.address,
    });
    expect(balance).toBe(0n);

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_B,
      transaction: MintableERC721.mintWithSignature({
        contract,
        ...result,
      }), // diff account can mint
    });

    balance = await balanceOf({
      contract,
      owner: TEST_ACCOUNT_B.address,
    });
    expect(balance).toBe(1n);
  });

  it("should mint tokens with batch metadata", async () => {
    // should have minted 2 tokens at this point
    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: MintableERC721.mintWithRole({
        contract,
        nfts: ["ipfs://some-uri/0", "ipfs://some-uri/1"],
        to: TEST_ACCOUNT_A.address,
      }),
    });

    await sendAndConfirmTransaction({
      account: TEST_ACCOUNT_A,
      transaction: MintableERC721.mintWithRole({
        contract,
        nfts: ["ipfs://some-other-uri/0"],
        to: TEST_ACCOUNT_A.address,
      }),
    });

    expect(
      await tokenURI({
        contract,
        tokenId: 2n,
      }),
    ).toBe("ipfs://some-uri/0");
    expect(
      await tokenURI({
        contract,
        tokenId: 3n,
      }),
    ).toBe("ipfs://some-uri/1");
    expect(
      await tokenURI({
        contract,
        tokenId: 4n,
      }),
    ).toBe("ipfs://some-other-uri/0");
  });
});
