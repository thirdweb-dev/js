import { describe, it } from "vitest";
import { render } from "../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { PayEmbed } from "./PayEmbed.js";

describe("Pay Embed", () => {
  it("should render", () => {
    render(<PayEmbed client={TEST_CLIENT} />);
  });
});
