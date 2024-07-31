"use client";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { StyledOption, StyledSelect } from "../../ui/design-system/elements.js";

export function CountrySelector({
  countryCode,
  setCountryCode,
}: {
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const selectRef = useRef<HTMLSelectElement>(null);

  const { data: supportedCountries } = useQuery({
    queryKey: ["supported-sms-countries"],
    queryFn: async () => {
      const { supportedSmsCountries } = await import(
        "./supported-sms-countries.js"
      );
      return supportedSmsCountries;
    },
  });

  const supportedCountriesForSms = supportedCountries ?? [
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
          paddingLeft: spacing.md,
          paddingRight: "0",
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
              value={`${country.countryIsoCode} +${country.phoneNumberCode}`}
            >
              {country.countryName} +{country.phoneNumberCode}{" "}
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
    fontSize: fontSize.sm,
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
