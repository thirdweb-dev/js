import { type FC, useContext } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, renderHook, screen, waitFor } from "~test/react-render.js";
import { DOODLES_CONTRACT } from "~test/test-contracts.js";
import { NFTDescription } from "./description.js";
import { NFTMedia } from "./media.js";
import { NFTName } from "./name.js";
import { NFTProvider, NFTProviderContext, useNFTContext } from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("NFTProvider", () => {
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
        <NFTDescription />
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

  it("useNFTContext should return the context value when used within NFTProvider", () => {
    const wrapper: FC = ({ children }: React.PropsWithChildren) => (
      <NFTProvider contract={DOODLES_CONTRACT} tokenId={0n}>
        {children}
      </NFTProvider>
    );

    const { result } = renderHook(() => useNFTContext(), { wrapper });

    expect(result.current.contract).toStrictEqual(DOODLES_CONTRACT);
    expect(result.current.tokenId).toBe(0n);
  });

  it("useNFTContext should throw an error when used outside of NFTProvider", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useNFTContext());
    }).toThrow(
      "NFTProviderContext not found. Make sure you are using NFTMedia, NFTDescription, etc. inside a <NFTProvider /> component",
    );

    consoleErrorSpy.mockRestore();
  });
});
