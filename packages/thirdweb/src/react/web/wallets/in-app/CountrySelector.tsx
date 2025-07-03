"use client";
import { useRef } from "react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../core/design-system/index.js";
import { StyledOption, StyledSelect } from "../../ui/design-system/elements.js";
import {
  type SupportedSmsCountry,
  supportedSmsCountries,
} from "./supported-sms-countries.js";

export function getCountrySelector(countryIsoCode: SupportedSmsCountry) {
  const country = supportedSmsCountries.find(
    (country) => country.countryIsoCode === countryIsoCode,
  );
  if (!country) {
    return "US +1";
  }
  return `${country.countryIsoCode} +${country.phoneNumberCode}`;
}

export function CountrySelector({
  countryCode,
  setCountryCode,
  allowedCountryCodes,
}: {
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
  allowedCountryCodes?: SupportedSmsCountry[];
}) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const supportedCountriesForSms =
    allowedCountryCodes && allowedCountryCodes.length > 0
      ? supportedSmsCountries.filter((c) =>
          allowedCountryCodes.includes(c.countryIsoCode as SupportedSmsCountry),
        )
      : (supportedSmsCountries ?? [
          {
            countryIsoCode: "US",
            countryName: "United States",
            phoneNumberCode: 1,
          },
        ]);

  return (
    <Select
      name="countries"
      onChange={(e) => {
        setCountryCode(e.target.value);
      }}
      ref={selectRef}
      style={{
        padding: `${spacing.sm} ${spacing.md}`,
      }}
      value={countryCode}
    >
      <Option
        style={{
          display: "none",
        }}
        value={countryCode}
      >
        {countryCode}
      </Option>
      {supportedCountriesForSms.map((country) => {
        return (
          <Option
            key={country.countryIsoCode}
            value={getCountrySelector(country.countryIsoCode)}
          >
            {country.countryName} +{country.phoneNumberCode}
          </Option>
        );
      })}
    </Select>
  );
}

const Option = /* @__PURE__ */ StyledOption(() => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.tertiaryBg,
    },
    background: theme.colors.modalBg,
    color: theme.colors.primaryText,
    transition: "background 0.3s ease",
  };
});

const Select = /* @__PURE__ */ StyledSelect((_) => {
  const theme = useCustomTheme();
  return {
    "&::placeholder": {
      color: theme.colors.secondaryText,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
    appearance: "none",
    background: "transparent",
    border: "none",
    borderRadius: radius.lg,
    boxSizing: "border-box",
    color: theme.colors.primaryText,
    cursor: "pointer",
    display: "block",
    maxWidth: "90px",
    minWidth: "0px",
    outline: "none",
    overflow: "hidden",
    padding: spacing.sm,
    textOverflow: "ellipsis",
    WebkitAppearance: "none",
    whiteSpace: "nowrap",
  };
});
