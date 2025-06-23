"use client";

import type { ThirdwebContract } from "thirdweb";
import { totalAccounts } from "thirdweb/extensions/erc4337";
import { useReadContract } from "thirdweb/react";
import { StatCard } from "../../overview/components/stat-card";

type AccountsCountProps = {
  contract: ThirdwebContract;
};

export const AccountsCount: React.FC<AccountsCountProps> = ({ contract }) => {
  const totalAccountsQuery = useReadContract(totalAccounts, { contract });
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
      <StatCard
        isPending={totalAccountsQuery.isPending}
        label="Total Accounts"
        value={totalAccountsQuery.data?.toString() || "0"}
      />
    </div>
  );
};
