import { describe, it } from "vitest";
import { render } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { EnsAvatar, type EnsAvatarProps } from "./index.js";

describe("EnsAvatar", () => {
  it("should render", async () => {
    const props: EnsAvatarProps = {
      name: "vitalik.eth",
      client: TEST_CLIENT,
    };
    const Component = await EnsAvatar(props);
    render(Component);
    // as long as this doesn't throw error I think it's good?
  });
});
