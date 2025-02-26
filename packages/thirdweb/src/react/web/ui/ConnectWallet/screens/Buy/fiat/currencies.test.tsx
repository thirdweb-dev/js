import { describe, expect, it } from "vitest";
import { CADIcon } from "../../../icons/currencies/CADIcon.js";
import { EURIcon } from "../../../icons/currencies/EURIcon.js";
import { GBPIcon } from "../../../icons/currencies/GBPIcon.js";
import { JPYIcon } from "../../../icons/currencies/JPYIcon.js";
import { USDIcon } from "../../../icons/currencies/USDIcon.js";
import { currencies, getCurrencyMeta, usdCurrency } from "./currencies.js";

describe("Currency Utilities", () => {
  it("should have correct number of currencies", () => {
    expect(currencies.length).toBe(7);
  });

  it("should have USD as the first currency", () => {
    expect(currencies[0]).toEqual(usdCurrency);
  });

  it("should have correct properties for each currency", () => {
    for (const currency of currencies) {
      expect(currency).toHaveProperty("shorthand");
      expect(currency).toHaveProperty("name");
    }
  });

  describe("getCurrencyMeta function", () => {
    it("should return correct currency meta for valid shorthand", () => {
      const cadMeta = getCurrencyMeta("CAD");
      expect(cadMeta.shorthand).toBe("CAD");
      expect(cadMeta.name).toBe("Canadian Dollar");
      expect(cadMeta.icon).toBe(CADIcon);
    });

    it("should be case-insensitive", () => {
      const eurMeta = getCurrencyMeta("eur");
      expect(eurMeta.shorthand).toBe("EUR");
      expect(eurMeta.name).toBe("Euro");
      expect(eurMeta.icon).toBe(EURIcon);
    });

    it("should return unknown currency for invalid shorthand", () => {
      const unknownMeta = getCurrencyMeta("XYZ");
      expect(unknownMeta.shorthand).toBe("XYZ");
      expect(unknownMeta.name).toBe("XYZ");
      expect(unknownMeta.icon).not.toBe(USDIcon);
      expect(unknownMeta.icon).not.toBe(CADIcon);
      expect(unknownMeta.icon).not.toBe(GBPIcon);
      expect(unknownMeta.icon).not.toBe(EURIcon);
      expect(unknownMeta.icon).not.toBe(JPYIcon);
    });
  });
});
