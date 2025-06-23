import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  IframePlayer,
  LinkPlayer,
  MediaRenderer,
  mergeRefs,
} from "./MediaRenderer.js";

const three3dModelLink =
  "https://i2.seadn.io/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/bd1801876c5cf1302484e225c72959/49bd1801876c5cf1302484e225c72959.glb";
const imageLink =
  "https://i.seadn.io/gae/r_b9GB0iYA39ichUlKdFLeG4UliK7YXi9SsM0Xdvm6pNDChYbN5E7Fxop1MdJCbmNvSlbER73YiA9WY1JbhEfkuIktoHfN9UlEZy4A?auto=format&dpr=1&w=1000";

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

  it("should render a plain image", async () => {
    render(<MediaRenderer client={TEST_CLIENT} src={imageLink} />);
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  describe("mergeRefs", () => {
    it("should call all callback refs with the given value", () => {
      const callbackRef1 = vi.fn();
      const callbackRef2 = vi.fn();

      const mergedRef = mergeRefs([callbackRef1, callbackRef2]);

      const testValue = { test: "value" };
      mergedRef(testValue);

      expect(callbackRef1).toHaveBeenCalledWith(testValue);
      expect(callbackRef2).toHaveBeenCalledWith(testValue);
    });

    it("should assign the value to all mutable object refs", () => {
      const mutableRef1 = React.createRef();
      const mutableRef2 = React.createRef();

      const mergedRef = mergeRefs([mutableRef1, mutableRef2]);

      const testValue = { test: "value" };
      mergedRef(testValue);

      expect(mutableRef1.current).toBe(testValue);
      expect(mutableRef2.current).toBe(testValue);
    });

    it("should handle a mix of callback and mutable object refs", () => {
      const callbackRef = vi.fn();
      const mutableRef = React.createRef();

      const mergedRef = mergeRefs([callbackRef, mutableRef]);

      const testValue = { test: "value" };
      mergedRef(testValue);

      expect(callbackRef).toHaveBeenCalledWith(testValue);
      expect(mutableRef.current).toBe(testValue);
    });

    it("should do nothing if refs array is empty", () => {
      const mergedRef = mergeRefs([]);

      expect(() => mergedRef(null)).not.toThrow();
    });
  });

  describe("LinkPlayer", () => {
    it("renders with default props", () => {
      render(<LinkPlayer />);

      const linkElement = screen.getByText("File");
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.tagName).toBe("A");
      expect(linkElement).toHaveAttribute("target", "_blank");
      expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders with custom src and alt", () => {
      const src = "https://example.com/file";
      const alt = "Custom File Name";
      render(<LinkPlayer alt={alt} src={src} />);

      const linkElement = screen.getByText(alt);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute("href", src);
    });

    it("applies custom style and className", () => {
      const customStyle = { backgroundColor: "red" };
      const customClassName = "custom-class";
      const { container } = render(
        <LinkPlayer className={customClassName} style={customStyle} />,
      );

      const outerDiv = container.querySelector(".custom-class");
      if (!outerDiv) {
        throw new Error("Failed to render LinkPlayer");
      }
      const styles = window.getComputedStyle(outerDiv);
      expect(styles.backgroundColor).toBe("red");
    });

    it("forwards ref to anchor element", () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(<LinkPlayer ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe("IframePlayer", () => {
    beforeEach(() => {
      // Reset the body before each test
      document.body.innerHTML = "";
    });

    it("renders with default props", () => {
      render(<IframePlayer />);

      const iframe = screen.getByTitle("thirdweb iframe player");
      expect(iframe).toBeInTheDocument();
      expect(iframe.tagName).toBe("IFRAME");
      expect(iframe).toHaveAttribute("sandbox", "allow-scripts");
      expect(iframe).toHaveAttribute(
        "allow",
        "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
      );
    });

    it("applies custom src and alt", () => {
      const src = "https://example.com/video";
      const alt = "Custom Video";
      render(<IframePlayer alt={alt} src={src} />);

      const iframe = screen.getByTitle(alt);
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute("src", src);
    });

    it("renders poster image when provided", () => {
      const poster = "https://example.com/poster.jpg";
      render(<IframePlayer poster={poster} />);

      const posterImg = screen.getByRole("img");
      expect(posterImg).toBeInTheDocument();
      expect(posterImg).toHaveAttribute("src", poster);
    });

    it("toggles play state when PlayButton is clicked", async () => {
      render(<IframePlayer src="https://example.com/video" />);

      const playButton = screen.getByRole("button");
      expect(playButton).toBeInTheDocument();

      const iframe = screen.getByTitle("thirdweb iframe player");
      expect(iframe).toHaveAttribute("src", "https://example.com/video");

      fireEvent.click(playButton);

      // After clicking, the iframe src should be undefined
      expect(iframe).not.toHaveAttribute("src");

      fireEvent.click(playButton);

      // After clicking again, the iframe src should be restored
      expect(iframe).toHaveAttribute("src", "https://example.com/video");
    });

    it("applies custom style", () => {
      const customStyle = { backgroundColor: "red" };
      const { container } = render(
        <IframePlayer className="iframe-test" style={customStyle} />,
      );

      const element = container.querySelector(".iframe-test");
      if (!element) {
        throw new Error("no iframe detected");
      }
      expect(element).toHaveStyle("background-color: red");
    });

    it("forwards ref to iframe element", () => {
      const ref = React.createRef<HTMLIFrameElement>();
      render(<IframePlayer ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLIFrameElement);
    });

    it("respects requireInteraction prop", () => {
      render(
        <IframePlayer requireInteraction src="https://example.com/video" />,
      );

      const iframe = screen.getByTitle("thirdweb iframe player");
      expect(iframe).not.toHaveAttribute("src");

      const playButton = screen.getByRole("button");
      fireEvent.click(playButton);

      expect(iframe).toHaveAttribute("src", "https://example.com/video");
    });
  });

  it("should render poster image for 3d models", async () => {
    render(
      <MediaRenderer
        client={TEST_CLIENT}
        poster={imageLink}
        src={three3dModelLink}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });
});
