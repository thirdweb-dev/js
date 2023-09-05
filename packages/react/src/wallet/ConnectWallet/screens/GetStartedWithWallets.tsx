import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { fontSize, iconSize, spacing, Theme } from "../../../design-system";
import { GetStartedScreen } from "./GetStartedScreen";
import styled from "@emotion/styled";
import { SecondaryText } from "../../../components/text";
import { useWallets } from "@thirdweb-dev/react-core";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";

export const GetStartedWithWallets: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const walletConfigs = useWallets();
  const { meta } = walletConfigs[0];
  const modalConfig = useContext(ModalConfigCtx);
  const isCompact = modalConfig.modalSize === "compact";

  return (
    <GetStartedScreen
      onBack={isCompact ? onBack : undefined}
      walletIconURL={meta.iconURL}
      walletName={meta.name}
      appleStoreLink={meta.urls?.ios}
      googlePlayStoreLink={meta.urls?.android}
      chromeExtensionLink={meta.urls?.chrome}
      header={
        <>
          <ModalTitle> Get started with EVM wallets </ModalTitle>
          <Spacer y="md" />

          <ModalDescription sm={isCompact}>
            An EVM Wallet is your gateway to interact with web3 apps on Ethereum
            and other custom blockchains.
          </ModalDescription>

          <Spacer y="md" />

          {/* Recommendation */}
          <div
            style={{
              display: "flex",
              gap: spacing.md,
              alignItems: "center",
            }}
          >
            <SecondaryText
              style={
                isCompact
                  ? {
                      fontSize: fontSize.sm,
                    }
                  : undefined
              }
            >
              We recommend
            </SecondaryText>
            <div
              style={{
                display: "flex",
                gap: spacing.xs,
                alignItems: "center",
              }}
            >
              <Img
                src={meta.iconURL}
                width={iconSize.md}
                height={iconSize.md}
              />
              <NeutralText>{meta.name}</NeutralText>
            </div>
          </div>
        </>
      }
      footer={
        <>
          <Spacer y="lg" />
          <HelperLink
            target="_blank"
            href="https://ethereum.org/en/wallets/find-wallet/"
            style={{
              textAlign: "center",
            }}
          >
            Learn more about wallets
          </HelperLink>{" "}
        </>
      }
    />
  );
};

const NeutralText = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.neutral};
  margin: 0;
`;
