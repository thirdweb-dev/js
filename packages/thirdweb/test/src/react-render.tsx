import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { ThirdwebProvider } from "../../src/react/web/providers/thirdweb-provider.js";
import { SetConnectedWallet } from "./SetConnectedWallet.js";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    setConnectedWallet?: boolean;
  },
) => {
  return render(
    <div>
      {options?.setConnectedWallet ? <SetConnectedWallet /> : null}
      {ui}
    </div>,
    { wrapper: Providers, ...options },
  );
};

export * from "@testing-library/react";
export { customRender as render };
