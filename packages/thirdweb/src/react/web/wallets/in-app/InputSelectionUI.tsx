"use client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { IconButton } from "../../ui/components/buttons.js";
import { Input, InputContainer } from "../../ui/components/formElements.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Text } from "../../ui/components/text.js";
import { CountrySelector, getCountrySelector } from "./CountrySelector.js";
import type { SupportedSmsCountry } from "./supported-sms-countries.js";

export function InputSelectionUI(props: {
  onSelect: (data: string) => void;
  placeholder: string;
  name: string;
  type: string;
  errorMessage?: (input: string) => string | undefined;
  emptyErrorMessage?: string;
  submitButtonText: string;
  format?: "phone";
  disabled?: boolean;
  defaultSmsCountryCode?: SupportedSmsCountry;
  allowedSmsCountryCodes?: SupportedSmsCountry[];
}) {
  const [countryCodeInfo, setCountryCodeInfo] = useState(
    props.defaultSmsCountryCode
      ? getCountrySelector(props.defaultSmsCountryCode)
      : props.allowedSmsCountryCodes &&
          props.allowedSmsCountryCodes.length > 0 &&
          props.allowedSmsCountryCodes[0]
        ? getCountrySelector(props.allowedSmsCountryCodes[0])
        : "US +1",
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [showError, setShowError] = useState(false);

  const handleSelect = () => {
    setShowError(true);
    if (!input || !!error) {
      return;
    }

    props.onSelect(
      props.format === "phone"
        ? `+${countryCodeInfo.split("+")[1]}${input}`
        : input,
    );
  };

  const renderingError =
    (showError && !!error) ||
    (!input && !!props.emptyErrorMessage && showError);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <InputContainer
        data-error={renderingError}
        style={{
          display: "flex",
          flexDirection: "row",
          position: "relative",
        }}
      >
        {props.format === "phone" && (
          <CountrySelector
            allowedCountryCodes={props.allowedSmsCountryCodes}
            countryCode={countryCodeInfo}
            setCountryCode={setCountryCodeInfo}
          />
        )}
        <Input
          disabled={props.disabled}
          name={props.name}
          onChange={(e) => {
            setInput(e.target.value);
            if (props.errorMessage) {
              setError(props.errorMessage(e.target.value));
            } else {
              setError(undefined);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSelect();
            }
          }}
          placeholder={props.placeholder}
          style={{
            flexGrow: 1,
            padding: `${spacing.sm} ${
              props.format === "phone" ? 0 : spacing.sm
            }`,
          }}
          tabIndex={-1}
          type={props.type}
          value={input}
          variant="transparent"
        />
        <IconButton
          disabled={props.disabled}
          onClick={handleSelect}
          style={{
            borderRadius: `0 ${radius.md} ${radius.md} 0`,
            padding: spacing.sm,
          }}
        >
          <ArrowRightIcon height={iconSize.md} width={iconSize.md} />
        </IconButton>
      </InputContainer>

      {showError && error && (
        <>
          <Spacer y="xs" />
          <Text color="danger" size="sm">
            {error}
          </Text>
        </>
      )}

      {!(showError && error) &&
        !input &&
        props.emptyErrorMessage &&
        showError && (
          <>
            <Spacer y="xs" />
            <Text color="danger" size="sm">
              {props.emptyErrorMessage}
            </Text>
          </>
        )}
    </div>
  );
}
