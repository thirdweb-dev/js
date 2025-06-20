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
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "",
      },
      type: "DropERC721",
    });
    const contract = getContract({ address, chain, client });
    const result = await getERC721ClaimTo({
      account,
      claimParams: { quantity: 1n, type: "ERC721" },
      contract,
    });

    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        chain={chain}
        claimParams={{ quantity: 1n, type: "ERC721" }}
        client={client}
        contractAddress={address}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should work for an Edition Drop contract", async () => {
    const address = await deployERC1155Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "",
      },
      type: "DropERC1155",
    });
    const contract = getContract({ address, chain, client });
    const result = await getERC1155ClaimTo({
      account,
      claimParams: { quantity: 1n, tokenId: 0n, type: "ERC1155" },
      contract,
    });
    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        chain={chain}
        claimParams={{ quantity: 1n, tokenId: 0n, type: "ERC1155" }}
        client={client}
        contractAddress={address}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should throw an error if claim quantity / quantityInWei is not passed", async () => {
    const address = await deployERC20Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "",
      },
      type: "DropERC20",
    });
    const contract = getContract({ address, chain, client });
    await expect(
      getERC20ClaimTo({
        account,
        // @ts-ignore Intended for the test
        claimParams: { type: "ERC20" },
        contract,
      }),
    ).rejects.toThrowError("Missing quantity or quantityInWei");
  });

  it("should work for an Token Drop contract + quantity", async () => {
    const address = await deployERC20Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "",
      },
      type: "DropERC20",
    });
    const contract = getContract({ address, chain, client });
    const result = await getERC20ClaimTo({
      account,
      claimParams: { quantity: "1", type: "ERC20" },
      contract,
    });
    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        chain={chain}
        claimParams={{ quantity: "100", type: "ERC20" }}
        client={client}
        contractAddress={address}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should work for an Token Drop contract + quantityInWei", async () => {
    const address = await deployERC20Contract({
      account,
      chain,
      client,
      params: {
        contractURI: TEST_CONTRACT_URI,
        name: "",
      },
      type: "DropERC20",
    });
    const contract = getContract({ address, chain, client });
    const result = await getERC20ClaimTo({
      account,
      claimParams: { quantityInWei: 1000000n, type: "ERC20" },
      contract,
    });
    expect(result.to).toBe(address);
    expect(result.chain.id).toBe(chain.id);
    expect(result.client.clientId).toBe(client.clientId);
    expect("data" in result).toBe(true);

    // should also render <ClaimButton />
    render(
      <ClaimButton
        chain={chain}
        claimParams={{ quantityInWei: 1000000n, type: "ERC20" }}
        client={client}
        contractAddress={address}
      >
        Claim
      </ClaimButton>,
    );
    expect(screen.queryByText("Claim")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
