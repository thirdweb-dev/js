import { CustomContractCode } from "./cards/custom-contract-code";
import { Flex } from "@chakra-ui/react";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  return (
    <Flex direction="column" gap={8}>
      <CustomContractCode contractAddress={contractAddress} />
    </Flex>
  );
};
