import { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { AccountForm } from "components/settings/Account/AccountForm";
import { OnboardingTitle } from "./Title";

type OnboardingGeneralProps = {
  account: Account;
  onSave: (email: string) => void;
};

export const OnboardingGeneral: React.FC<OnboardingGeneralProps> = ({
  account,
  onSave,
}) => {
  return (
    <>
      <OnboardingTitle
        heading="Create your thirdweb account"
        description="Start building web3 apps and games, faster."
      />

      <AccountForm
        showSubscription
        optional
        account={account}
        buttonText="Get Started for Free"
        trackingCategory="onboarding"
        padded={false}
        buttonProps={{
          w: "full",
          size: "lg",
          fontSize: "md",
          variant: "inverted",
        }}
        onSave={onSave}
      />
    </>
  );
};
