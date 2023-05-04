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

export const GetStartedWithWallets: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const configuredWallets = useWallets();
  console.log({
    configuredWallets,
  });
  const { meta } = configuredWallets[0];

  return (
    <GetStartedScreen
      onBack={() => {
        onBack();
      }}
      walletIconURL={meta.iconURL}
      walletName={meta.name}
      appleStoreLink={meta.urls?.ios}
      googlePlayStoreLink={meta.urls?.android}
      chromeExtensionLink={meta.urls?.chrome}
      header={
        <>
          <ModalTitle> Get started with EVM wallets </ModalTitle>
          <Spacer y="md" />

          <ModalDescription>
            An EVM Wallet is your gateway to interact with web3 apps on Ethereum
            and other custom blockchains.
          </ModalDescription>

          <Spacer y="xl" />

          {/* Recommendation */}
          <div
            style={{
              display: "flex",
              gap: spacing.md,
              alignItems: "center",
            }}
          >
            <SecondaryText>We recommend</SecondaryText>
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
          <Spacer y="xl" />
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
