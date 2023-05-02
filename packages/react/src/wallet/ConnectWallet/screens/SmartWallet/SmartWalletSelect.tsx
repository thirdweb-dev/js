import { walletIds } from "@thirdweb-dev/wallets";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Flex } from "../../../../components/basic";
import { Button } from "../../../../components/buttons";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
} from "../../../../components/modalElements";
import { iconSize, spacing } from "../../../../design-system";
import { WalletSelection } from "../../WalletSelector";
import styled from "@emotion/styled";
import { SmartWalletObj } from "../../../wallets/smartWallet";
import { useWalletInfo, useWalletsInfo } from "../../walletInfo";

export const SmartWalletSelect: React.FC<{
  onBack: () => void;
  smartWallet: SmartWalletObj;
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
          src={props.smartWallet.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />
      <ModalTitle>Choose your wallet</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription>
        Select a personal wallet to connect to smart wallet
      </ModalDescription>

      <Spacer y="lg" />

      <WalletSelection walletsInfo={walletsInfo} />

      {guestWallet && (
        <>
          <Spacer y="xl" />
          <Flex justifyContent="center">
            <Button variant="link" onClick={guestWallet.connect}>
              Continue as guest
            </Button>
          </Flex>
        </>
      )}
    </>
  );
};

const IconContainer = styled.div`
  margin-top: ${spacing.lg};
`;
