import { useState } from "react";
import { Spacer } from "../../ui/components/Spacer.js";
import { Button } from "../../ui/components/buttons.js";
import { Input } from "../../ui/components/formElements.js";
import { Text } from "../../ui/components/text.js";

/**
 * @internal
 */
export function InputSelectionUI(props: {
  onSelect: (data: string) => void;
  placeholder: string;
  name: string;
  type: string;
  errorMessage?: (input: string) => string | undefined;
  emptyErrorMessage?: string;
  submitButtonText: string;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [showError, setShowError] = useState(false);

  const handleSelect = () => {
    setShowError(true);
    if (!input || !!error) {
      return;
    }

    props.onSelect(input);
  };

  const renderingError =
    (showError && !!error) ||
    (!input && !!props.emptyErrorMessage && showError);

  return (
    <div>
      <div
        style={{
          position: "relative",
        }}
      >
        <Input
          tabIndex={-1}
          placeholder={props.placeholder}
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
