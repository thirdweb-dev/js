import { Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { getAllActiveSigners, getAllAdmins } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { AccountSigner, type AccountSignerType } from "./account-signer";

interface AccountSignersProps {
  contract: ThirdwebContract;
}

export const AccountSigners: React.FC<AccountSignersProps> = ({ contract }) => {
  const { data: allAdmins } = useReadContract(getAllAdmins, { contract });
  const transformedAdmins: AccountSignerType[] = (allAdmins || []).map(
    (admin) => {
      return {
        isAdmin: true,
        signer: admin,
        startTimestamp: BigInt(new Date(0).getTime()),
        endTimestamp: BigInt(new Date(0).getTime()),
        nativeTokenLimitPerTransaction: 0n,
        approvedTargets: [],
      };
    },
  );
  const { data: allSigners } = useReadContract(getAllActiveSigners, {
    contract,
  });
  const transformedSigners: AccountSignerType[] = (allSigners || []).map(
    (signer) => ({ isAdmin: false, ...signer }),
  );
  const data = transformedAdmins.concat(transformedSigners || []);
  return (
    <Flex direction="column" gap={6}>
      {data.map((item) => (
        <AccountSigner key={item.signer} item={item} />
      ))}
    </Flex>
  );
};
