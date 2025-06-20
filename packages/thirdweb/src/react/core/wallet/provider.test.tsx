/** biome-ignore-all lint/nursery/useUniqueElementIds: "id" is not the html attribute here (TODO: we should not use "id" as a key in the first place) */
import { type FC, useContext } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, renderHook, screen } from "~test/react-render.js";
import {
  useWalletContext,
  WalletProvider,
  WalletProviderContext,
} from "./provider.js";

describe.runIf(process.env.TW_SECRET_KEY)("WalletProvider", () => {
  it("useWalletContext should throw an error when used outside of WalletProvider", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useWalletContext());
    }).toThrow(
      "WalletProviderContext not found. Make sure you are using WalletIcon, WalletName, etc. inside a <WalletProvider /> component",
    );

    consoleErrorSpy.mockRestore();
  });

  it("useWalletContext should return the context value when used within WalletProvider", () => {
    const wrapper: FC = ({ children }: React.PropsWithChildren) => (
      <WalletProvider id="io.metamask">{children}</WalletProvider>
    );

    const { result } = renderHook(() => useWalletContext(), { wrapper });

    expect(result.current.id).toStrictEqual("io.metamask");
  });

  it("should render children correctly", () => {
    render(
      <WalletProvider id="io.metamask">
        <div>Child Component</div>
      </WalletProvider>,
    );

    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("should provide context values to children", () => {
    function WalletConsumer() {
      const context = useContext(WalletProviderContext);
      if (!context) {
        return <div>No context</div>;
      }
      return <div>{String(context.id)}</div>;
    }
    render(
      <WalletProvider id="io.metamask">
        <WalletConsumer />
      </WalletProvider>,
    );

    expect(screen.getByText("io.metamask")).toBeInTheDocument();
  });
});
