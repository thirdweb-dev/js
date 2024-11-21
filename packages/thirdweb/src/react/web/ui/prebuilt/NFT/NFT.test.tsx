import { useContext } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "~test/react-render.js";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { getNFTInfo } from "./hooks.js";
import { NFTMedia } from "./media.js";
import { NFTName } from "./name.js";
import { NFTProvider, NFTProviderContext } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("NFT prebuilt component", () => {
  it("should fetch the NFT metadata", async () => {
    const nft = await getNFTInfo({
      contract: DOODLES_CONTRACT,
      tokenId: 1n,
    });
    expect(nft.metadata).toStrictEqual({
      attributes: [
        {
          trait_type: "face",
          value: "holographic beard",
        },
        {
          trait_type: "hair",
          value: "white bucket cap",
        },
        {
          trait_type: "body",
          value: "purple sweater with satchel",
        },
        {
          trait_type: "background",
          value: "grey",
        },
        {
          trait_type: "head",
          value: "gradient 2",
        },
      ],
      description:
        "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
      image: "ipfs://QmTDxnzcvj2p3xBrKcGv1wxoyhAn2yzCQnZZ9LmFjReuH9",
      name: "Doodle #1",
    });
  });

  it("should render children correctly", () => {
    render(
      <NFTProvider contract={DOODLES_CONTRACT} tokenId={0n}>
        <div>Child Component</div>
      </NFTProvider>,
    );

    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("should provide context values to children", () => {
    function NFTConsumer() {
      const context = useContext(NFTProviderContext);
      if (!context) {
        return <div>No context</div>;
      }
      return (
        <div>
          Contract: {String(context.contract)}, Token ID:{" "}
          {context.tokenId.toString()}
        </div>
      );
    }
    render(
      <NFTProvider contract={DOODLES_CONTRACT} tokenId={0n}>
        <NFTConsumer />
      </NFTProvider>,
    );

    expect(screen.getByText(/Contract:/)).toBeInTheDocument();
    expect(screen.getByText(/Token ID: 0/)).toBeInTheDocument();
  });

  it("should render the NFT image", () => {
    render(
      <NFTProvider contract={DOODLES_CONTRACT} tokenId={0n}>
        <NFTMedia />
      </NFTProvider>,
    );

    waitFor(() => expect(screen.getByRole("img")).toBeInTheDocument());
  });

  it("should render the NFT name", () => {
    render(
      <NFTProvider contract={DOODLES_CONTRACT} tokenId={1n}>
        <NFTName />
      </NFTProvider>,
    );

    waitFor(() => expect(screen.getByText("Doodle #1")).toBeInTheDocument());
  });

  it("should render the NFT description", () => {
    render(
      <NFTProvider contract={DOODLES_CONTRACT} tokenId={1n}>
        <NFTName />
      </NFTProvider>,
    );

    waitFor(() =>
      expect(
        screen.getByText(
          "A community-driven collectibles project featuring art by Burnt Toast",
        ),
      ).toBeInTheDocument(),
    );
  });
});
