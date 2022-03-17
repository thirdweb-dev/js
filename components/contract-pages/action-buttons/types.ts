import type { ButtonProps } from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";

export interface IContractActionButtonProps extends ButtonProps {
  account?: string;
  contract?: ValidContractInstance;
}
