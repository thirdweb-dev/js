import { useWallets } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { Input } from "../../components/formElements";
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
}) {
  const [input, setInput] = useState("");
  const singleWallet = useWallets().length === 1;
  const setWalletConfig = useSetWalletModalConfig();

  const handleSelect = () => {
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
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSelect();
            }
          }}
        />

        <CircleInputButton
          disabled={!input}
          color="inverted"
          type="button"
          onClick={handleSelect}
        >
          <ArrowRightIcon width={iconSize.xs} height={iconSize.xs} />
        </CircleInputButton>
      </div>

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
  background: ${(p) => p.theme.bg.inverted};
  border-radius: 50%;
  padding: ${spacing.xxs};
  color: ${(p) => p.theme.text.inverted};
  position: absolute;
  top: 50%;
  right: ${spacing.md};
  transform: translateY(-50%);
  &:hover {
    color: ${(p) => p.theme.text.inverted};
  }
`;
