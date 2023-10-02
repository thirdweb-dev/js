import { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { AccountForm } from "components/settings/Account/AccountForm";
import { OnboardingTitle } from "./Title";

type OnboardingGeneralProps = {
  account: Account;
  onSave: (email: string) => void;
  onCancel: () => void;
};

export const OnboardingGeneral: React.FC<OnboardingGeneralProps> = ({
  account,
  onSave,
  onCancel,
}) => {
  return (
    <>
      <OnboardingTitle
        heading={
          <>
            Welcome to <strong>thirdweb</strong>
          </>
        }
        description="Enter a name and email to manage your billing info, and receive our latest product updates."
      />

      <AccountForm
        showCancelButton
        showSubscription
        optional
        account={account}
        buttonText="Next"
        trackingCategory="onboarding"
        padded={false}
        buttonProps={{
          w: "full",
          size: "lg",
          fontSize: "md",
          variant: "inverted",
        }}
        onSave={onSave}
        onCancel={onCancel}
      />
    </>
  );
};
