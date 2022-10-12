import { Flex, Spacer, Spinner } from "@chakra-ui/react";
import { useProgramAccountType } from "@thirdweb-dev/react/solana";
import { ContractCode } from "components/contract-tabs/code/ContractCode";

export const ProgramCodeTab: React.FC<{ address: string }> = ({ address }) => {
  const accountType = useProgramAccountType(address);
  return accountType.isSuccess ? (
    <ContractCode
      contractAddress={address}
      contractType={accountType.data}
      ecosystem="solana"
    />
  ) : (
    <Flex>
      <Spacer />
      <Spinner color="purple.500" size="md" />
      <Spacer />
    </Flex>
  );
};
