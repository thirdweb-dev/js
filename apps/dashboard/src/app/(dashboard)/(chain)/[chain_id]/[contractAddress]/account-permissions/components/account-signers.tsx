"use client";

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
        // default here has to be in seconds not milliseconds (because contract stores in seconds...)
        endTimestamp: BigInt(new Date(0).getTime() / 1000),
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
    <div>
      <h1 className="mb-4 font-semibold text-2xl tracking-tight">
        Account Signers
      </h1>
      <div className="flex flex-col gap-6">
        {data.map((item) => (
          <AccountSigner
            key={item.signer}
            item={item}
            contractChainId={contract.chain.id}
          />
        ))}
      </div>
    </div>
  );
};
