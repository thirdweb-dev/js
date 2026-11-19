import { type ComponentProps, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CheckoutWidget } from "thirdweb/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportPaymentLinkBuySuccessful } from "@/analytics/report";
import { PayPageWidget } from "./PayPageWidget.client";

vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "light" }) }));
vi.mock("thirdweb/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("thirdweb/react")>()),
  AutoConnect: () => null,
  CheckoutWidget: vi.fn(() => null),
}));
vi.mock("@/analytics/report", () => ({
  reportPaymentLinkBuyFailed: vi.fn(),
  reportPaymentLinkBuySuccessful: vi.fn(),
}));
vi.mock("@/hooks/chains/v5-adapter", () => ({
  useV5DashboardChain: () => ({ id: 1 }),
}));

const open = vi.fn();

beforeEach(() => {
  vi.stubGlobal("window", { open });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

function completeCheckout(redirectUri: string | undefined): void {
  renderToStaticMarkup(
    createElement(PayPageWidget, {
      chainId: 1,
      clientId: "test-client-id",
      purchaseData: undefined,
      recipientAddress: "0x0000000000000000000000000000000000000001",
      redirectUri,
      token: {
        address: "0x0000000000000000000000000000000000000002",
        decimals: 18,
        name: "Test token",
        symbol: "TEST",
      },
    }),
  );
  const props = vi.mocked(CheckoutWidget).mock.calls[0]?.[0] as
    | ComponentProps<typeof CheckoutWidget>
    | undefined;
  expect(props?.onSuccess).toBeTypeOf("function");
  // This handler does not consume the SDK's payment result.
  const onSuccess = props?.onSuccess as (() => void) | undefined;
  onSuccess?.();
}

describe("payment success redirect", () => {
  it.each([
    [
      "https://merchant.example/complete?order=1#receipt",
      "https://merchant.example/complete?order=1#receipt",
    ],
    ["http://localhost:3000/done", "http://localhost:3000/done"],
    ["HTTPS://MERCHANT.EXAMPLE", "https://merchant.example/"],
  ])(
    "opens %s without giving the destination an opener",
    (input, normalized) => {
      completeCheckout(input);
      expect(open.mock.calls).toEqual([
        [normalized, "_blank", "noopener,noreferrer"],
      ]);
      expect(reportPaymentLinkBuySuccessful).toHaveBeenCalledOnce();
    },
  );

  it.each([
    undefined,
    "",
    "not a URL",
    "/relative/path",
    "//merchant.example/done",
    "https://",
    "javascript:alert(1)",
    " JaVaScRiPt:alert(1)",
    "data:text/html,hello",
    "file:///tmp/receipt.html",
    "ftp://merchant.example/receipt",
    "blob:https://merchant.example/id",
    "mailto:merchant@example.com",
  ])(
    "ignores invalid or non-HTTP destination %s without breaking checkout",
    (input) => {
      expect(() => completeCheckout(input)).not.toThrow();
      expect(open).not.toHaveBeenCalled();
      expect(reportPaymentLinkBuySuccessful).toHaveBeenCalledOnce();
    },
  );
});
