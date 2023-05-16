import { useWallets } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { ErrorMessage, Input } from "../../components/formElements";
import { Spacer } from "../../components/Spacer";
import { TextDivider } from "../../components/TextDivider";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Theme, iconSize, spacing } from "../../design-system";
import { InputButton } from "../../components/buttons";
import styled from "@emotion/styled";
import { useSetWalletModalConfig } from "../../evm/providers/wallet-ui-states-provider";

export function InputSelectionUI(props: {
  onSelect: () => void;
  placeholder: string;
  name: string;
  type: string;
  errorMessage?: (input: string) => string | undefined;
}) {
  const [input, setInput] = useState("");
  const singleWallet = useWallets().length === 1;
  const setWalletConfig = useSetWalletModalConfig();
  const [error, setError] = useState<string | undefined>();
  const [showError, setShowError] = useState(false);

  const handleSelect = () => {
    setShowError(true);
    if (!input || !!error) {
      return;
    }

    setWalletConfig((config) => ({ ...config, data: input }));
    props.onSelect();
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
        }}
      >
        <Input
          placeholder={props.placeholder}
          variant="secondary"
          type={props.type}
          name={props.name}
          value={input}
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

const CircleInputButton = styled(InputButton)<{ theme?: Theme }>`
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
