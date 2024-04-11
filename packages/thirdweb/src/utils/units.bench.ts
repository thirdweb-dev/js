import { bench } from "vitest";
import { toTokens, toUnits } from "./units.js";

bench("units:toTokens(12345678901234567890n, 18)", () => {
  toTokens(12345678901234567890n, 18);
});

bench("units:toTokens(40000000000000000000n, 18)", () => {
  toTokens(40000000000000000000n, 18);
});

bench(`units:toUnits("40", 18)`, () => {
  toUnits("40", 18);
});

bench(`units:toUnits("40.0", 18)`, () => {
  toUnits("40.0", 18);
});
