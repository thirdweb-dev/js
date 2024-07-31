import { useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import { fontSize, spacing } from "../../../design-system";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";
import { StyledOption, StyledSelect } from "../../../design-system/elements";

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
        "@thirdweb-dev/wallets/evm/connectors/embedded-wallet/implementations"
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
      >
        <option
          style={{
            display: "none",
          }}
          value={countryCode}
        >
          {countryCode}
        </option>
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
      background: theme.colors.walletSelectorButtonHoverBg,
    },
  };
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Select = /* @__PURE__ */ StyledSelect((_) => {
  const theme = useCustomTheme();
  return {
    fontSize: fontSize.sm,
    display: "block",
    padding: spacing.sm,
    boxSizing: "border-box",
    outline: "none",
    border: "none",
    borderRadius: "6px",
    color: theme.colors.primaryText,
    WebkitAppearance: "none",
    appearance: "none",
    cursor: "pointer",
    background: "transparent",
    "&::placeholder": {
      color: theme.colors.secondaryText,
    },
    boxShadow: `0 0 0 1.5px ${theme.colors.borderColor}`,
    "&:focus, &:hover": {
      boxShadow: `0 0 0 2px ${theme.colors.accentText}`,
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
