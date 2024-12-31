import { describe, expect, it } from "vitest";
import { render } from "~test/react-render.js";
import {
  CarbonDocumentAudio,
  CarbonDocumentUnknown,
  CarbonPauseFilled,
  CarbonPlayFilledAlt,
} from "./icons.js";

describe("MediaRenderer Icons", () => {
  it("renders CarbonDocumentUnknown correctly", () => {
    const { container } = render(<CarbonDocumentUnknown />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    expect(container.querySelector("svg")).toHaveAttribute("height", "16");
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 32 32",
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "role",
      "presentation",
    );
  });

  it("renders CarbonDocumentAudio correctly", () => {
    const { container } = render(<CarbonDocumentAudio />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    expect(container.querySelector("svg")).toHaveAttribute("height", "16");
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 32 32",
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "role",
      "presentation",
    );
  });

  it("renders CarbonPauseFilled correctly", () => {
    const { container } = render(<CarbonPauseFilled />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    expect(container.querySelector("svg")).toHaveAttribute("height", "16");
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 32 32",
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "role",
      "presentation",
    );
  });

  it("renders CarbonPlayFilledAlt correctly", () => {
    const { container } = render(<CarbonPlayFilledAlt />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    expect(container.querySelector("svg")).toHaveAttribute("height", "16");
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 32 32",
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "role",
      "presentation",
    );
  });

  it("applies custom props to the svg element", () => {
    const { container } = render(
      <CarbonDocumentUnknown data-testid="custom-icon" />,
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-testid",
      "custom-icon",
    );
  });
});
