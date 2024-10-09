import { describe, expect, it } from "vitest";

import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../../contract/contract.js";
import { deployERC721Contract } from "../../../extensions/prebuilts/deploy-erc721.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { parseNFT } from "../../../utils/nft/parseNft.js";
import { setTokenURI } from "../__generated__/INFTMetadata/write/setTokenURI.js";
import { mintTo } from "../write/mintTo.js";
import { getNFT } from "./getNFT.js";

describe.runIf(process.env.TW_SECRET_KEY)("erc721.getNFT", () => {
  it("without owner", async () => {
    const nft = await getNFT({
      contract: { ...DOODLES_CONTRACT },
      tokenId: 1n,
      includeOwner: false,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "id": 1n,
        "metadata": {
          "attributes": [
            {
              "trait_type": "face",
              "value": "holographic beard",
            },
            {
              "trait_type": "hair",
              "value": "white bucket cap",
            },
            {
              "trait_type": "body",
              "value": "purple sweater with satchel",
            },
            {
              "trait_type": "background",
              "value": "grey",
            },
            {
              "trait_type": "head",
              "value": "gradient 2",
            },
          ],
          "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
          "image": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "name": "Doodle #1",
        },
        "owner": null,
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
  });

  it("with owner", async () => {
    const nft = await getNFT({
      contract: { ...DOODLES_CONTRACT },
      tokenId: 1n,
      includeOwner: true,
    });
    expect(nft).toMatchInlineSnapshot(`
      {
        "id": 1n,
        "metadata": {
          "attributes": [
            {
              "trait_type": "face",
              "value": "holographic beard",
            },
            {
              "trait_type": "hair",
              "value": "white bucket cap",
            },
            {
              "trait_type": "body",
              "value": "purple sweater with satchel",
            },
            {
              "trait_type": "background",
              "value": "grey",
            },
            {
              "trait_type": "head",
              "value": "gradient 2",
            },
          ],
          "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
          "image": "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
          "name": "Doodle #1",
        },
        "owner": "0xbE9936FCFC50666f5425FDE4A9decC59cEF73b24",
        "tokenURI": "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/1",
        "type": "ERC721",
      }
    `);
  });

  it("should return a default value if the URI of the token doesn't exist", async () => {
    /**
     * To create this test scenario, we first deploy an NFTCollection/Edition contract,
     * mint a token, then purposefully change that token's URI to an empty string, using setTokenURI
     */
    const contract = getContract({
      address: await deployERC721Contract({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_A,
        type: "TokenERC721",
        params: {
          name: "",
          contractURI: TEST_CONTRACT_URI,
        },
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });

    await sendAndConfirmTransaction({
      transaction: mintTo({
        contract,
        nft: { name: "token 0" },
        to: TEST_ACCOUNT_A.address,
      }),
      account: TEST_ACCOUNT_A,
    });

    await sendAndConfirmTransaction({
      transaction: setTokenURI({
        contract,
        tokenId: 0n,
        // Need to have some spaces because NFTMetadata.sol does not allow to update an empty valud
        uri: "  ",
      }),
      account: TEST_ACCOUNT_A,
    });

    expect(await getNFT({ contract, tokenId: 0n })).toStrictEqual(
      parseNFT(
        {
          id: 0n,
          type: "ERC721",
          uri: "",
        },
        {
          tokenId: 0n,
          tokenUri: "",
          type: "ERC721",
          owner: null,
        },
      ),
    );
  });
});
