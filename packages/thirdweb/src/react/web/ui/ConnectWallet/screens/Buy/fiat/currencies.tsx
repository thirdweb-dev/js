import { RadiobuttonIcon } from "@radix-ui/react-icons";
import { CADIcon } from "../../../icons/currencies/CADIcon.js";
import { EURIcon } from "../../../icons/currencies/EURIcon.js";
import { GBPIcon } from "../../../icons/currencies/GBPIcon.js";
import { JPYIcon } from "../../../icons/currencies/JPYIcon.js";
import { USDIcon } from "../../../icons/currencies/USDIcon.js";
import type { IconFC } from "../../../icons/types.js";

export type CurrencyMeta = {
  shorthand: "USD" | "CAD" | "GBP" | "EUR" | "JPY";
  name: string;
  symbol: string;
  icon: IconFC;
};

export const usdCurrency: CurrencyMeta = {
  shorthand: "USD",
  name: "US Dollar",
  symbol: "$",
  icon: USDIcon,
};

export const currencies: CurrencyMeta[] = [
  usdCurrency,
  {
    shorthand: "CAD",
    name: "Canadian Dollar",
    symbol: "$",
    icon: CADIcon,
  },
  {
    shorthand: "GBP",
    name: "British Pound",
    symbol: "£",
    icon: GBPIcon,
  },
  {
    shorthand: "EUR",
    name: "Euro",
    symbol: "€",
    icon: EURIcon,
  },
  {
    shorthand: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    icon: JPYIcon,
  },
];

export function getCurrencyMeta(shorthand: string): CurrencyMeta {
  return (
    currencies.find(
      (currency) =>
        currency.shorthand.toLowerCase() === shorthand.toLowerCase(),
    ) ?? {
      // This should never happen
      icon: UnknownCurrencyIcon,
      name: shorthand,
      symbol: "$",
      shorthand: shorthand as CurrencyMeta["shorthand"],
    }
  );
}

const UnknownCurrencyIcon: IconFC = (props) => {
  return <RadiobuttonIcon width={props.size} height={props.size} />;
};
