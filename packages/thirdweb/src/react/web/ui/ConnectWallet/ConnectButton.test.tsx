import { describe, expect, it } from "vitest";
import { render, screen } from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { ConnectButton } from "./ConnectButton.js";

describe("ConnectButton", () => {
  it("renders", () => {
    render(<ConnectButton client={TEST_CLIENT} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
