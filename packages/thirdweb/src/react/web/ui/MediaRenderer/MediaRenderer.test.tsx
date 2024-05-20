import { describe, expect, it } from "vitest";
import {
  render,
  screen,
  waitFor,
} from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import { MediaRenderer } from "./MediaRenderer.js";

describe("MediaRenderer", () => {
  it("should render nothing if no src provided", () => {
    render(<MediaRenderer client={TEST_CLIENT} />);
    expect(screen.queryByText("File")).not.toBeInTheDocument(); // would display file if it shows the "not found" div
  });

  it("should render unknown if nothing found", () => {
    render(<MediaRenderer client={TEST_CLIENT} src="asaosdoiandoin" />);
    setTimeout(() => {
      expect(screen.queryByText("File")).toBeInTheDocument(); // would display file if it shows the "not found" div
    }, 1000);
  });

  it("should render a plain image", () => {
    render(
      <MediaRenderer
        client={TEST_CLIENT}
        src="https://i.seadn.io/gae/r_b9GB0iYA39ichUlKdFLeG4UliK7YXi9SsM0Xdvm6pNDChYbN5E7Fxop1MdJCbmNvSlbER73YiA9WY1JbhEfkuIktoHfN9UlEZy4A?auto=format&dpr=1&w=1000"
      />,
    );
    waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });
});
