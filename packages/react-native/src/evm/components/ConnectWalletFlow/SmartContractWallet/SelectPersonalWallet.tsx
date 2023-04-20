import { ConnectWalletHeader } from "../ConnectingWallet/ConnectingWalletHeader";

export type SelectPersonalWalletProps = {
  onClose: () => void;
};

export const SelectPersonalWallet = ({
  onClose,
}: SelectPersonalWalletProps) => {
  return (
    <>
      <ConnectWalletHeader
        headerText={"Select your personal wallet"}
        subHeaderText={
          "Select and connect your personal wallet. This will be the key to your on-chain account."
        }
        alignHeader="flex-start"
        onClose={onClose}
        onBackPress={onClose}
      />
    </>
  );
};
