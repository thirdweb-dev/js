import type { Account } from "@3rdweb-sdk/react/hooks/useApi";

export const SettingsReferralPage = (props: {
  account: Account;
}) => {
  return (
    <div>
      <h1 className="mb-0.5 font-semibold text-2xl tracking-tight">
        Referral Link
      </h1>

      <p className="mb-7 text-muted-foreground">
        Share this link with your users!
      </p>

      {/* <Separator />
      <Notifications account={props.account} /> */}
    </div>
  );
};
