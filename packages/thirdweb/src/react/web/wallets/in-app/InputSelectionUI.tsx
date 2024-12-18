"use client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import {
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { IconButton } from "../../ui/components/buttons.js";
import { Input, InputContainer } from "../../ui/components/formElements.js";
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
}) {
  const [countryCodeInfo, setCountryCodeInfo] = useState(
    props.defaultSmsCountryCode
      ? getCountrySelector(props.defaultSmsCountryCode)
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
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
        }}
        data-error={renderingError}
      >
        {props.format === "phone" && (
          <CountrySelector
            countryCode={countryCodeInfo}
            setCountryCode={setCountryCodeInfo}
          />
        )}
        <Input
          tabIndex={-1}
          placeholder={props.placeholder}
          style={{
            flexGrow: 1,
            padding: `${spacing.sm} ${
              props.format === "phone" ? 0 : spacing.sm
            }`,
          }}
          variant="transparent"
          type={props.type}
          name={props.name}
          value={input}
          disabled={props.disabled}
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
        />
        <IconButton
          onClick={handleSelect}
          disabled={props.disabled}
          style={{
            padding: spacing.sm,
            borderRadius: `0 ${radius.md} ${radius.md} 0`,
          }}
        >
          <ArrowRightIcon width={iconSize.md} height={iconSize.md} />
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
