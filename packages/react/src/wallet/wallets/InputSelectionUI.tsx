import { useState } from "react";
import { ErrorMessage, Input } from "../../components/formElements";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";
import { Button } from "../../components/buttons";

export function InputSelectionUI(props: {
  onSelect: (data: string) => void;
  placeholder: string;
  name: string;
  type: string;
  errorMessage?: (input: string) => string | undefined;
  emptyErrorMessage?: string;
  showOrSeparator?: boolean;
  footer?: React.ReactNode;
  noInput?: boolean;
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
      {!props.noInput && (
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
      )}

      {showError && error && (
        <>
          <Spacer y="xs" />
          <ErrorMessage>{error}</ErrorMessage>
        </>
      )}

      {!(showError && error) &&
        !input &&
        props.emptyErrorMessage &&
        showError && (
          <>
            <Spacer y="xs" />
            <ErrorMessage>{props.emptyErrorMessage}</ErrorMessage>
          </>
        )}

      <Spacer y="md" />
      <Button variant="accent" onClick={handleSelect} fullWidth>
        Continue
      </Button>
      {props.footer}

      {props.showOrSeparator && (
        <>
          <Spacer y="lg" />
          <TextDivider>
            <span> OR </span>
          </TextDivider>
          <Spacer y="md" />
        </>
      )}
    </div>
  );
}
