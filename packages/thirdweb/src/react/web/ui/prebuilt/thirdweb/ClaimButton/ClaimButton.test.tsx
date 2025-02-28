import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "~test/chains.js";
import { TEST_CONTRACT_URI } from "~test/ipfs-uris.js";
import { render, screen } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { getContract } from "../../../../../../contract/contract.js";
import { deployERC20Contract } from "../../../../../../extensions/prebuilts/deploy-erc20.js";
import { deployERC721Contract } from "../../../../../../extensions/prebuilts/deploy-erc721.js";
import { deployERC1155Contract } from "../../../../../../extensions/prebuilts/deploy-erc1155.js";
import {
  ClaimButton,
  getERC20ClaimTo,
  getERC721ClaimTo,
  getERC1155ClaimTo,
} from "./index.js";

const account = TEST_ACCOUNT_A;
const client = TEST_CLIENT;
const chain = ANVIL_CHAIN;

/**
 * The ClaimButton uses TransactionButton under the hood
 * So all we need to test is whether it gives the correct PreparedTransaction to the TransactionButton
 */
describe.runIf(process.env.TW_SECRET_KEY)("ClaimButton", () => {
  // ERC721

  it("should work for an NFT Drop contract", async () => {
    const address = await deployERC721Contract({
      client,
      chain,
      account,
      type: "DropERC721",
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({ address, client, chain });
    const result = await getERC721ClaimTo({
      contract,
      account,
      claimParams: { type: "ERC721", quantity: 1n },
    });

    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        client={client}
        chain={chain}
        contractAddress={address}
        claimParams={{ quantity: 1n, type: "ERC721" }}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should work for an Edition Drop contract", async () => {
    const address = await deployERC1155Contract({
      client,
      chain,
      account,
      type: "DropERC1155",
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({ address, client, chain });
    const result = await getERC1155ClaimTo({
      contract,
      account,
      claimParams: { type: "ERC1155", quantity: 1n, tokenId: 0n },
    });
    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        client={client}
        chain={chain}
        contractAddress={address}
        claimParams={{ quantity: 1n, type: "ERC1155", tokenId: 0n }}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should throw an error if claim quantity / quantityInWei is not passed", async () => {
    const address = await deployERC20Contract({
      client,
      chain,
      account,
      type: "DropERC20",
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({ address, chain, client });
    await expect(
      getERC20ClaimTo({
        contract,
        account,
        // @ts-ignore Intended for the test
        claimParams: { type: "ERC20" },
      }),
    ).rejects.toThrowError("Missing quantity or quantityInWei");
  });

  it("should work for an Token Drop contract + quantity", async () => {
    const address = await deployERC20Contract({
      client,
      chain,
      account,
      type: "DropERC20",
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({ address, chain, client });
    const result = await getERC20ClaimTo({
      contract,
      account,
      claimParams: { type: "ERC20", quantity: "1" },
    });
    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        client={client}
        chain={chain}
        contractAddress={address}
        claimParams={{ quantity: "100", type: "ERC20" }}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should work for an Token Drop contract + quantityInWei", async () => {
    const address = await deployERC20Contract({
      client,
      chain,
      account,
      type: "DropERC20",
      params: {
        name: "",
        contractURI: TEST_CONTRACT_URI,
      },
    });
    const contract = getContract({ address, chain, client });
    const result = await getERC20ClaimTo({
      contract,
      account,
      claimParams: { type: "ERC20", quantityInWei: 1000000n },
    });
    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        client={client}
        chain={chain}
        contractAddress={address}
        claimParams={{ quantityInWei: 1000000n, type: "ERC20" }}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
