import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { ThirdwebProvider } from "../../src/react/web/providers/thirdweb-provider.js";
import { SetConnectedWallet } from "./SetConnectedWallet.js";
import type { WalletId } from "src/wallets/wallet-types.js";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    setConnectedWallet?: boolean;
    walletId?: WalletId;
  },
) => {
  return render(
    <div>
      {options?.setConnectedWallet ? (
        <SetConnectedWallet id={options.walletId} />
      ) : null}
      {ui}
    </div>,
    { wrapper: Providers, ...options },
  );
};

export * from "@testing-library/react";
export { customRender as render };
