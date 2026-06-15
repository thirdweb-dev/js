import type { EIP1193Provider } from "viem";
import { describe, expect, it, vi } from "vitest";
import { TEST_ACCOUNT_A } from "~test/test-wallets.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import {
  createWalletEmitter,
  type WalletDisconnectError,
} from "../wallet-emitter.js";
import { autoConnectEip1193Wallet } from "./index.js";

describe("injected wallet onDisconnect", () => {
  // biome-ignore lint/suspicious/noExplicitAny: test listener registry
  type Listener = (...args: any[]) => void;

  async function connectAndGetDisconnectHandler() {
    let disconnectHandler:
      | ((error?: WalletDisconnectError) => void)
      | undefined;

    const provider = {
      on: vi.fn((event: string, listener: Listener) => {
        if (event === "disconnect") {
          disconnectHandler = listener;
        }
      }),
      removeListener: vi.fn(),
      request: vi.fn(async ({ method }: { method: string }) => {
        if (method === "eth_accounts") {
          return [TEST_ACCOUNT_A.address];
        }
        if (method === "eth_chainId") {
          return "0x1";
        }
        return undefined;
      }),
    } as unknown as EIP1193Provider;

    const emitter = createWalletEmitter<"io.metamask">();
    const onDisconnect = vi.fn();
    emitter.subscribe("disconnect", onDisconnect);

    await autoConnectEip1193Wallet({
      client: TEST_CLIENT,
      emitter,
      id: "io.metamask",
      provider,
    });

    if (!disconnectHandler) {
      throw new Error("disconnect handler was not registered");
    }

    return { disconnectHandler, onDisconnect, provider };
  }

  it("ignores transient 1013 disconnects (disconnected, will reconnect)", async () => {
    const { disconnectHandler, onDisconnect, provider } =
      await connectAndGetDisconnectHandler();

    await disconnectHandler({ code: 1013, message: "will reconnect" });

    expect(onDisconnect).not.toHaveBeenCalled();
    expect(provider.removeListener).not.toHaveBeenCalled();
  });

  it("emits disconnect with the error for non-transient disconnects", async () => {
    const { disconnectHandler, onDisconnect } =
      await connectAndGetDisconnectHandler();

    const error: WalletDisconnectError = {
      code: 4900,
      message: "disconnected",
    };
    await disconnectHandler(error);

    expect(onDisconnect).toHaveBeenCalledWith(error);
  });

  it("emits disconnect with undefined when no error is provided", async () => {
    const { disconnectHandler, onDisconnect } =
      await connectAndGetDisconnectHandler();

    await disconnectHandler();

    expect(onDisconnect).toHaveBeenCalledWith(undefined);
  });
});
