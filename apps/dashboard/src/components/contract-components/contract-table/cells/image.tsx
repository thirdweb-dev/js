import { ContractIdImage } from "components/contract-components/shared/contract-id-image";
import { DeployableContractContractCellProps } from "components/contract-components/types";

export const ContractImageCell: React.FC<
  DeployableContractContractCellProps
> = ({ cell: { value } }) => {
  return <ContractIdImage contractId={value} />;
};
