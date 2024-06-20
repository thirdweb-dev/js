import { Flex } from "@chakra-ui/react";
import {
  useAccountAdminsAndSigners,
  type useContract,
} from "@thirdweb-dev/react";
import { AccountSigner } from "./account-signer";

interface AccountSignersProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const AccountSigners: React.FC<AccountSignersProps> = ({
  contractQuery,
}) => {
  const accountSignersQuery = useAccountAdminsAndSigners(
    contractQuery?.contract,
  );

  return (
    <Flex direction="column" gap={6}>
      {accountSignersQuery.data?.map((signer) => (
        <AccountSigner
          key={signer.signer}
          signer={signer}
          isAdmin={signer.isAdmin || false}
        />
      ))}
    </Flex>
  );
};
