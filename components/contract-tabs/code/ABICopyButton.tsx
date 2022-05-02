import { useContractConstructor } from "@3rdweb-sdk/react";
import { useClipboard } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { useMemo } from "react";
import { FiCopy } from "react-icons/fi";
import { Button, ButtonProps } from "tw-components";

interface ABICopyButtonProps extends ButtonProps {
  contract: ValidContractInstance;
}
export const ABICopyButton: React.FC<ABICopyButtonProps> = ({
  ...restButtonProps
}) => {
  const contractConstructor = useContractConstructor(restButtonProps.contract);
  const abi = useMemo(() => {
    return contractConstructor ? contractConstructor.contractAbi : null;
  }, [contractConstructor]);

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
    <Button {...restButtonProps} leftIcon={<FiCopy />} onClick={onCopy}>
      {hasCopied ? "ABI Copied" : "Copy ABI"}
    </Button>
  );
};
