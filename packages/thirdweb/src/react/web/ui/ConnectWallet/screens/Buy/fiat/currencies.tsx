import { RadiobuttonIcon } from "@radix-ui/react-icons";
import type { SupportedFiatCurrency } from "../../../../../../../pay/convert/type.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { CADIcon } from "../../../icons/currencies/CADIcon.js";
import { EURIcon } from "../../../icons/currencies/EURIcon.js";
import { GBPIcon } from "../../../icons/currencies/GBPIcon.js";
import { JPYIcon } from "../../../icons/currencies/JPYIcon.js";
import { USDIcon } from "../../../icons/currencies/USDIcon.js";
import type { IconFC } from "../../../icons/types.js";

export type CurrencyMeta = {
  shorthand: SupportedFiatCurrency;
  countryCode: string;
  name: string;
  symbol: string;
  icon?: IconFC;
};

export const usdCurrency: CurrencyMeta = {
  shorthand: "USD",
  countryCode: "US",
  name: "US Dollar",
  symbol: "$",
  icon: USDIcon,
};

export const currencies: CurrencyMeta[] = [
  usdCurrency,
  {
    shorthand: "CAD",
    countryCode: "CA",
    name: "Canadian Dollar",
    symbol: "$",
    icon: CADIcon,
  },
  {
    shorthand: "GBP",
    countryCode: "GB",
    name: "British Pound",
    symbol: "£",
    icon: GBPIcon,
  },
  {
    shorthand: "EUR",
    countryCode: "EU",
    name: "Euro",
    symbol: "€",
    icon: EURIcon,
  },
  {
    shorthand: "JPY",
    countryCode: "JP",
    name: "Japanese Yen",
    symbol: "¥",
    icon: JPYIcon,
  },
  {
    shorthand: "AUD",
    countryCode: "AU",
    name: "Australian Dollar",
    symbol: "$",
  },
  {
    shorthand: "NZD",
    countryCode: "NZ",
    name: "New Zealand Dollar",
    symbol: "$",
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
      countryCode: "US",
      name: shorthand,
      symbol: "$",
      shorthand: shorthand as CurrencyMeta["shorthand"],
    }
  );
}

export function getFiatIcon(
  currency: CurrencyMeta,
  size: keyof typeof iconSize,
): React.ReactNode {
  return currency.icon ? (
    <currency.icon size={iconSize[size]} />
  ) : (
    <img
      src={`https://flagsapi.com/${currency.countryCode.toUpperCase()}/flat/64.png`}
      alt={currency.shorthand}
      width={iconSize[size]}
      height={iconSize[size]}
    />
  );
}
const UnknownCurrencyIcon: IconFC = (props) => {
  return <RadiobuttonIcon width={props.size} height={props.size} />;
};
