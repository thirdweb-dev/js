import { useState } from "react";
import { Spacer } from "../../ui/components/Spacer.js";
import { Button } from "../../ui/components/buttons.js";
import { Input } from "../../ui/components/formElements.js";
import { Text } from "../../ui/components/text.js";
import { spacing } from "../../ui/design-system/index.js";
import { CountrySelector } from "./CountrySelector.js";

export function InputSelectionUI(props: {
  onSelect: (data: string) => void;
  placeholder: string;
  name: string;
  type: string;
  errorMessage?: (input: string) => string | undefined;
  emptyErrorMessage?: string;
  submitButtonText: string;
  format?: "phone";
}) {
  const [countryCodeInfo, setCountryCodeInfo] = useState("US +1");
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
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          gap: spacing.sm,
        }}
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
          }}
          variant="outline"
          type={props.type}
          name={props.name}
          value={input}
          data-error={renderingError}
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
      </div>

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

      <Spacer y="md" />
      <Button variant="accent" onClick={handleSelect} fullWidth>
        {props.submitButtonText}
      </Button>
    </div>
  );
}
