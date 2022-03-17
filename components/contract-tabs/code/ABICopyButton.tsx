import { useContractConstructor } from "@3rdweb-sdk/react";
import { ButtonProps, useClipboard } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { useMemo } from "react";
import { ImCopy } from "react-icons/im";

interface ABICopyButtonProps extends ButtonProps {
  contract: ValidContractInstance;
}
export const ABICopyButton: React.FC<ABICopyButtonProps> = ({
  ...restButtonProps
}) => {
  const contractConstructor = useContractConstructor(restButtonProps.contract);
  const abi = useMemo(() => {
    return contractConstructor ? contractConstructor.contractFactory.abi : null;
  }, [contractConstructor]);

  const { onCopy, hasCopied, value } = useClipboard(
    JSON.stringify(abi, null, 2),
  );
  if (!value) {
    return (
      <Button {...restButtonProps} leftIcon={<ImCopy />} isDisabled>
        ABI not available
      </Button>
    );
  }

  return (
    <Button {...restButtonProps} leftIcon={<ImCopy />} onClick={onCopy}>
      {hasCopied ? "ABI Copied" : "Copy ABI"}
    </Button>
  );
};
