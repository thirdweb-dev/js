import { RadiobuttonIcon } from "@radix-ui/react-icons";
import { CADIcon } from "../../../icons/currencies/CADIcon.js";
import { EURIcon } from "../../../icons/currencies/EURIcon.js";
import { GBPIcon } from "../../../icons/currencies/GBPIcon.js";
import { USDIcon } from "../../../icons/currencies/USDIcon.js";
import type { IconFC } from "../../../icons/types.js";

export type CurrencyMeta = {
  shorthand: "USD" | "CAD" | "GBP" | "EUR";
  name: string;
  icon: IconFC;
};

export const defaultSelectedCurrency: CurrencyMeta = {
  shorthand: "USD",
  name: "US Dollar",
  icon: USDIcon,
};

export const currencies: CurrencyMeta[] = [
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

export function getCurrencyMeta(shorthand: string): CurrencyMeta {
  return (
    currencies.find(
      (currency) =>
        currency.shorthand.toLowerCase() === shorthand.toLowerCase(),
    ) ?? {
      // This should never happen
      icon: UnknownCurrencyIcon,
      name: shorthand,
      shorthand: shorthand as CurrencyMeta["shorthand"],
    }
  );
}

const UnknownCurrencyIcon: IconFC = (props) => {
  return <RadiobuttonIcon width={props.size} height={props.size} />;
};
