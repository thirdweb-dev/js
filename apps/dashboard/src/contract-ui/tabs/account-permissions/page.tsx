import type { ThirdwebContract } from "thirdweb";
import { Heading } from "tw-components";
import { AccountSigners } from "./components/account-signers";

interface AccountPermissionsPageProps {
  contract: ThirdwebContract;
}

export const AccountPermissionsPage: React.FC<AccountPermissionsPageProps> = ({
  contract,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between">
        <Heading size="title.sm">Account Signers</Heading>
      </div>
      <AccountSigners contract={contract} />
    </div>
  );
};
