import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import type { ReactElement } from "react";
import { ThirdwebProvider } from "../../src/react/core/providers/thirdweb-provider.js";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

const customRenderHook = (
  // biome-ignore lint/suspicious/noExplicitAny: Reusing the type from renderHook
  callback: (props: { children: React.ReactNode }) => any,
  options?: Omit<RenderOptions, "wrapper">,
) => renderHook(callback, { wrapper: Providers, ...options });

export * from "@testing-library/react";

export { customRender as render };
export { customRenderHook as renderHook };
