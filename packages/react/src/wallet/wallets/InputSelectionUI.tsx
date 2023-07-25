import { useState } from "react";
import { ErrorMessage, Input } from "../../components/formElements";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Theme, iconSize, spacing } from "../../design-system";
import { InputButton } from "../../components/buttons";
import styled from "@emotion/styled";
import { WalletConfig } from "@thirdweb-dev/react-core";

export function InputSelectionUI(props: {
  onSelect: (data: any) => void;
  placeholder: string;
  name: string;
  type: string;
  errorMessage?: (input: string) => string | undefined;
  emptyErrorMessage?: string;
  supportedWallets: WalletConfig[];
}) {
  const [input, setInput] = useState("");
  const singleWallet = props.supportedWallets.length === 1;
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
          variant="secondary"
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

        <CircleInputButton
          onClick={() => {
            handleSelect();
          }}
          color="inverted"
          type="button"
        >
          <ArrowRightIcon width={iconSize.sm} height={iconSize.sm} />
        </CircleInputButton>
      </div>

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

      {!singleWallet && (
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
