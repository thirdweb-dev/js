import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../../../test/src/react-render.js";
import { getCountrySelector } from "./CountrySelector.js";
import { InputSelectionUI } from "./InputSelectionUI.js";

vi.mock("./CountrySelector.js", async (importOriginal) => ({
  ...(await importOriginal()),
  getCountrySelector: vi.fn(),
}));

describe("InputSelectionUI", () => {
  it("should initialize countryCodeInfo with defaultSmsCountryCode", () => {
    const mockGetCountrySelector = vi.mocked(getCountrySelector);
    mockGetCountrySelector.mockReturnValue("CA +1");

    render(
      <InputSelectionUI
        defaultSmsCountryCode="CA"
        onSelect={vi.fn()}
        placeholder=""
        name=""
        type=""
        submitButtonText=""
        format="phone"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("CA +1");
  });

  it('should initialize countryCodeInfo with "US +1" if defaultSmsCountryCode is not provided', () => {
    render(
      <InputSelectionUI
        onSelect={vi.fn()}
        placeholder=""
        name=""
        type=""
        submitButtonText=""
        format="phone"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("US +1");
  });

  it("should filter countries based on allowedSmsCountryCodes", () => {
    const mockGetCountrySelector = vi.mocked(getCountrySelector);
    mockGetCountrySelector.mockReturnValue("IN +91");

    render(
      <InputSelectionUI
        onSelect={vi.fn()}
        placeholder=""
        name=""
        type=""
        submitButtonText=""
        format="phone"
        allowedSmsCountryCodes={["IN", "BR"]}
      />,
    );

    const options = screen.getAllByRole("option");
    const optionTexts = options.map((o) => o.textContent);
    expect(optionTexts.some((t) => t?.includes("India"))).toBe(true);
    expect(optionTexts.some((t) => t?.includes("Brazil"))).toBe(true);
    expect(optionTexts.some((t) => t?.includes("United States"))).toBe(false);
  });
});
