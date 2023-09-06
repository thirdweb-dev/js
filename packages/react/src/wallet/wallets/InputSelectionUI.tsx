import { useState } from "react";
import { ErrorMessage, Input } from "../../components/formElements";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Theme, iconSize, spacing } from "../../design-system";
import { Button, InputButton } from "../../components/buttons";
import styled from "@emotion/styled";

export function InputSelectionUI(props: {
  onSelect: (data: any) => void;
  placeholder: string;
  name: string;
  type: string;
  errorMessage?: (input: string) => string | undefined;
  emptyErrorMessage?: string;
  showOrSeparator?: boolean;
  footer?: React.ReactNode;
  noInput?: boolean;
  submitType: "inline" | "button";
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

          {props.submitType === "inline" && (
            <CircleInputButton
              onClick={() => {
                handleSelect();
              }}
              color="inverted"
              type="button"
            >
              <ArrowRightIcon width={iconSize.sm} height={iconSize.sm} />
            </CircleInputButton>
          )}
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

      {props.submitType === "button" && (
        <>
          <Spacer y="md" />
          <Button variant="inverted" onClick={handleSelect} fullWidth>
            Continue
          </Button>
        </>
      )}

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

const CircleInputButton = /* @__PURE__ */ styled(InputButton)<{
  theme?: Theme;
}>`
  background: ${(p) => p.theme.bg.highlighted};
  border-radius: 50%;
  padding: ${spacing.xxs};
  color: ${(p) => p.theme.text.neutral};
  position: absolute;
  top: 50%;
  right: ${spacing.sm};
  transform: translateY(-50%);
  &:hover {
    color: ${(p) => p.theme.text.neutral};
  }
`;
