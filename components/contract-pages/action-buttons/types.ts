import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { ButtonProps } from "tw-components";

export interface IContractActionButtonProps extends ButtonProps {
  contract?: ValidContractInstance;
}
