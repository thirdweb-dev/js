import { walletIds } from "@thirdweb-dev/wallets";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Flex } from "../../../../components/basic";
import { Button } from "../../../../components/buttons";
import {
  BackButton,
  ModalTitle,
  HelperLink,
  ModalDescription,
} from "../../../../components/modalElements";
import { iconSize, spacing } from "../../../../design-system";
import { WalletSelection } from "../../WalletSelector";
import { Steps } from "./Steps";
import styled from "@emotion/styled";
import { SafeWalletObj } from "../../../wallets/safeWallet";
import { useWalletInfo, useWalletsInfo } from "../../walletInfo";

export const SelectpersonalWallet: React.FC<{
  onBack: () => void;
  safeWallet: SafeWalletObj;
}> = (props) => {
  const guestWallet = useWalletInfo("localWallet", false);
  const allWalletsInfo = useWalletsInfo();

  const walletsInfo = allWalletsInfo.filter(
    (w) =>
      w.wallet.id !== walletIds.smartWallet &&
      w.wallet.id !== walletIds.safe &&
      w.wallet.id !== walletIds.localWallet,
  );

  return (
    <>
      <BackButton onClick={props.onBack} />
      <IconContainer>
        <Img
          src={props.safeWallet.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />
      <ModalTitle>Choose your Wallet</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription>
        Select a personal wallet to connect to your Safe
      </ModalDescription>

      <Spacer y="xl" />
      <Steps step={1} />
      <Spacer y="lg" />

      <WalletSelection walletsInfo={walletsInfo} />

      <Spacer y="xl" />

      {guestWallet ? (
        <Flex justifyContent="center">
          <Button variant="link" onClick={guestWallet.connect}>
            Continue as guest
          </Button>
        </Flex>
      ) : (
        <HelperLink
          target="_blank"
          href="https://docs.safe.global/learn/what-is-a-smart-contract-account"
          style={{
            textAlign: "center",
          }}
        >
          What is a Safe?
        </HelperLink>
      )}
    </>
  );
};

const IconContainer = styled.div`
  margin-top: ${spacing.lg};
`;
