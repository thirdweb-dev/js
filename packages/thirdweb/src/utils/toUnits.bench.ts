import { bench } from "vitest";
import { toUnits } from "./units.js";

bench(`units:toUnits("40", 18)`, () => {
  toUnits("40", 18);
});

bench(`units:toUnits("40.0", 18)`, () => {
  toUnits("40.0", 18);
});
