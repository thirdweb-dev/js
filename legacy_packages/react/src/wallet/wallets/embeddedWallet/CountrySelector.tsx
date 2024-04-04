import { useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import { Theme, fontSize, spacing } from "../../../design-system";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";
import { StyledSelect } from "../../../design-system/elements";

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
      const { supportedSmsCountries } = await import("@thirdweb-dev/wallets");
      return supportedSmsCountries;
    },
  });

  const supportedCountriesForSms = supportedCountries ?? [
    {
      countryIsoCode: "US",
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
      >
        {supportedCountriesForSms.map((country) => {
          return (
            <option
              key={country.countryIsoCode}
              value={`${country.countryIsoCode} +${country.phoneNumberCode}`}
            >
              {country.countryIsoCode} +{country.phoneNumberCode}
            </option>
          );
        })}
      </Select>
    </>
  );
}

type SelectProps = {
  sm?: boolean;
  theme?: Theme;
};

export const Select = /* @__PURE__ */ StyledSelect((props: SelectProps) => {
  const theme = useCustomTheme();
  return {
    fontSize: fontSize.md,
    display: "block",
    padding: props.sm ? spacing.sm : fontSize.sm,
    boxSizing: "border-box",
    outline: "none",
    border: "none",
    borderRadius: "6px",
    color: theme.colors.primaryText,
    WebkitAppearance: "none",
    appearance: "none",
    background: "transparent",
    "&::placeholder": {
      color: theme.colors.secondaryText,
    },
    boxShadow: `0 0 0 1.5px ${theme.colors.borderColor}`,

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
