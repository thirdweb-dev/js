import { describe, it } from "vitest";
import { render } from "~test/react-render.js";
import { ThirdwebProvider } from "./thirdweb-provider.js";

describe("thirdweb-provider", () => {
  it("should render", () => {
    render(
      <ThirdwebProvider>
        <div />
      </ThirdwebProvider>,
    );
  });
});
