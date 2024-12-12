import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
} from "../../../../../test/src/react-render.js";
import { CountrySelector } from "./CountrySelector.js";

describe("CountrySelector", () => {
  it("renders with default country code", () => {
    const setCountryCode = vi.fn();
    render(
      <CountrySelector countryCode="US +1" setCountryCode={setCountryCode} />,
    );

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeTruthy();
    expect(selectElement).toHaveValue("US +1");
  });

  it("changes country code on selection", () => {
    const setCountryCode = vi.fn();
    render(
      <CountrySelector countryCode="US +1" setCountryCode={setCountryCode} />,
    );

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "CA +1" } });

    expect(setCountryCode).toHaveBeenCalledWith("CA +1");
  });

  it("displays all supported countries", () => {
    const setCountryCode = vi.fn();
    render(
      <CountrySelector countryCode="US +1" setCountryCode={setCountryCode} />,
    );

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    expect(
      options.some((option) => option.textContent?.includes("United States")),
    ).toBe(true);
  });
});
