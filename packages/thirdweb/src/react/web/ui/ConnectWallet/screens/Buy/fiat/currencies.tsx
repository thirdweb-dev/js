import { CADIcon } from "../../../icons/currencies/CADIcon.js";
import { EURIcon } from "../../../icons/currencies/EURIcon.js";
import { GBPIcon } from "../../../icons/currencies/GBPIcon.js";
import { USDIcon } from "../../../icons/currencies/USDIcon.js";
import type { IconFC } from "../../../icons/types.js";

export type CurrencyMeta = {
  shorthand: string;
  name: string;
  icon: IconFC;
};

export const defaultSelectedCurrency: CurrencyMeta = {
  shorthand: "USD",
  name: "US Dollar",
  icon: USDIcon,
};

export const currencies = [
  defaultSelectedCurrency,
  {
    shorthand: "CAD",
    name: "Canadian Dollar",
    icon: CADIcon,
  },
  {
    shorthand: "GBP",
    name: "British Pound",
    icon: GBPIcon,
  },
  {
    shorthand: "EUR",
    name: "Euro",
    icon: EURIcon,
  },
];
