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
}: {
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const supportedCountriesForSms = supportedSmsCountries ?? [
    {
      countryIsoCode: "US",
      countryName: "United States",
      phoneNumberCode: 1,
    },
  ];

  return (
    <>
      <Select
        ref={selectRef}
        name="countries"
        id="countries"
        value={countryCode}
        onChange={(e) => {
          setCountryCode(e.target.value);
        }}
        style={{
          padding: `${spacing.sm} ${spacing.md}`,
        }}
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
    </>
  );
}

const Option = /* @__PURE__ */ StyledOption(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.primaryText,
    background: theme.colors.modalBg,
    transition: "background 0.3s ease",
    "&:hover": {
      background: theme.colors.tertiaryBg,
    },
  };
});

const Select = /* @__PURE__ */ StyledSelect((_) => {
  const theme = useCustomTheme();
  return {
    display: "block",
    padding: spacing.sm,
    boxSizing: "border-box",
    outline: "none",
    border: "none",
    borderRadius: radius.lg,
    color: theme.colors.primaryText,
    WebkitAppearance: "none",
    appearance: "none",
    cursor: "pointer",
    background: "transparent",
    "&::placeholder": {
      color: theme.colors.secondaryText,
    },
    "&[disabled]": {
      cursor: "not-allowed",
    },
    minWidth: "0px",
    maxWidth: "90px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  };
});
