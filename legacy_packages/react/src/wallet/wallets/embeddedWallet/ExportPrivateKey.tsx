import { Container, ModalHeader } from "../../../components/basic";
import { WalletInstance } from "@thirdweb-dev/react-core";
import { Theme } from "../../../design-system";

export const ExportPrivateKey: React.FC<{
  onBack?: () => void;
  walletInstance?: WalletInstance;
  walletAddress?: string;
  theme: "light" | "dark" | Theme;
}> = (props) => {
  return (
    <Container fullHeight animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title="Export Private Key" />
      </Container>
      <Container p="md">
        <iframe
          title="Export In-App Wallet"
          style={{
            width: "100%",
            height: "250px",
          }}
          allow="clipboard-read; clipboard-write"
          src={`https://embedded-wallet.thirdweb.com//sdk/2022-08-12/embedded-wallet/export-private-key?clientId=${
            props.walletInstance?.getOptions()?.clientId
          }&theme=${
            typeof props.theme === "string" ? props.theme : props.theme.type
          }`}
        />
      </Container>
    </Container>
  );
};
