import { useClipboard } from "@chakra-ui/react";
import { Abi } from "components/contract-components/types";
import { FiCheck, FiCopy } from "react-icons/fi";
import { Button, ButtonProps } from "tw-components";

interface ABICopyButtonProps extends ButtonProps {
  abi: Abi;
}
export const ABICopyButton: React.FC<ABICopyButtonProps> = ({
  abi,
  ...restButtonProps
}) => {
  const { onCopy, hasCopied, value } = useClipboard(
    JSON.stringify(abi, null, 2),
  );
  if (!value) {
    return (
      <Button {...restButtonProps} leftIcon={<FiCopy />} isDisabled>
        ABI not available
      </Button>
    );
  }

  return (
    <Button
      {...restButtonProps}
      leftIcon={hasCopied ? <FiCheck /> : <FiCopy />}
      onClick={onCopy}
    >
      {hasCopied ? "ABI Copied" : "Copy ABI"}
    </Button>
  );
};
