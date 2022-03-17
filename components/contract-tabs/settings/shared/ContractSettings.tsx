import { ContractPrimarySale } from "../fees/primary-sale";
import { ContractRoyalties } from "../fees/royalties";
import { VoteConfiguration } from "../modules/vote/VoteConfiguration";
import { ContractMetadata } from "./ContractMetadata";
import {
  hasPrimarySaleMechanic,
  hasRoyaltyMechanic,
  useIsAdmin,
} from "@3rdweb-sdk/react";
import { Stack } from "@chakra-ui/react";
import { ValidContractInstance, Vote } from "@thirdweb-dev/sdk";

interface IContractSettings {
  contract?: ValidContractInstance;
}

export const ContractSettings: React.FC<IContractSettings> = ({ contract }) => {
  const isAdmin = useIsAdmin(contract);

  if (!contract) {
    return <div>loading contract...</div>;
  }

  return (
    <Stack spacing={8}>
      <ContractMetadata contract={contract} isDisabled={!isAdmin} />
      {/* only if the contract has a primary sale mechanic */}
      {hasPrimarySaleMechanic(contract) && (
        <ContractPrimarySale contract={contract} isDisabled={!isAdmin} />
      )}
      {/* only if the contract has a royalty mechanic */}
      {hasRoyaltyMechanic(contract) && (
        <ContractRoyalties contract={contract} isDisabled={!isAdmin} />
      )}
      {contract instanceof Vote && <VoteConfiguration contract={contract} />}
    </Stack>
  );
};
