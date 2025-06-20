import { describe, expect, it } from "vitest";
import { render } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import en from "../locale/en.js";
import { ReceiveFunds } from "./ReceiveFunds.js";

const client = TEST_CLIENT;

describe("ReceiveFunds screen", () => {
  it("should render a title with locale.title", () => {
    const { container } = render(
      <ReceiveFunds client={client} connectLocale={en} onBack={() => {}} />,
    );
    const element = container.querySelector("h2");
    expect(element).not.toBe(null);
    expect(element?.innerHTML).toBe(en.receiveFundsScreen.title);
  });

  it("should render a span with locale.instruction", () => {
    const { container } = render(
      <ReceiveFunds client={client} connectLocale={en} onBack={() => {}} />,
    );
    const element = container.querySelector(
      "span.receive_fund_screen_instruction",
    );
    expect(element).not.toBe(null);
    expect(element?.innerHTML).toBe(en.receiveFundsScreen.instruction);
  });

  it("should render the CopyIcon", () => {
    const { container } = render(
      <ReceiveFunds client={client} connectLocale={en} onBack={() => {}} />,
    );
    const element = container.querySelector("svg.tw-copy-icon");
    expect(element).not.toBe(null);
  });
});
