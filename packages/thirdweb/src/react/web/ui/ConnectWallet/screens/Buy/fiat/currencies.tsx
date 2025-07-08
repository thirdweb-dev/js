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
  countryCode: "US",
  icon: USDIcon,
  name: "US Dollar",
  shorthand: "USD",
  symbol: "$",
};

export const currencies: CurrencyMeta[] = [
  usdCurrency,
  {
    countryCode: "CA",
    icon: CADIcon,
    name: "Canadian Dollar",
    shorthand: "CAD",
    symbol: "$",
  },
  {
    countryCode: "GB",
    icon: GBPIcon,
    name: "British Pound",
    shorthand: "GBP",
    symbol: "£",
  },
  {
    countryCode: "EU",
    icon: EURIcon,
    name: "Euro",
    shorthand: "EUR",
    symbol: "€",
  },
  {
    countryCode: "JP",
    icon: JPYIcon,
    name: "Japanese Yen",
    shorthand: "JPY",
    symbol: "¥",
  },
  {
    countryCode: "AU",
    name: "Australian Dollar",
    shorthand: "AUD",
    symbol: "$",
  },
  {
    countryCode: "NZ",
    name: "New Zealand Dollar",
    shorthand: "NZD",
    symbol: "$",
  },
];

export function getCurrencyMeta(shorthand: string): CurrencyMeta {
  return (
    currencies.find(
      (currency) =>
        currency.shorthand.toLowerCase() === shorthand.toLowerCase(),
    ) ?? {
      countryCode: "US",
      // This should never happen
      icon: UnknownCurrencyIcon,
      name: shorthand,
      shorthand: shorthand as CurrencyMeta["shorthand"],
      symbol: "$",
    }
  );
}

function getFiatIcon(
  currency: CurrencyMeta,
  size: keyof typeof iconSize,
): React.ReactNode {
  return currency.icon ? (
    <currency.icon size={iconSize[size]} />
  ) : (
    <img
      alt={currency.shorthand}
      height={iconSize[size]}
      src={`https://flagsapi.com/${currency.countryCode.toUpperCase()}/flat/64.png`}
      width={iconSize[size]}
    />
  );
}

export function getFiatCurrencyIcon(props: {
  currency: string;
  size: keyof typeof iconSize;
}): React.ReactNode {
  return getFiatIcon(getCurrencyMeta(props.currency), props.size);
}

const UnknownCurrencyIcon: IconFC = (props) => {
  return <RadiobuttonIcon height={props.size} width={props.size} />;
};
