import { DeployableContractContractCellProps } from "../../types";
import { ContractIdImage } from "components/contract-components/shared/contract-id-image";

export const ContractImageCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  return <ContractIdImage contractId={value} />;
};
