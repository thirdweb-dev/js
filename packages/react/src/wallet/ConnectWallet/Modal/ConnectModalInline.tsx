import { Theme, ThemeOptions } from "../../../design-system";
import styled from "@emotion/styled";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CrossContainer } from "../../../components/Modal";
import { IconButton } from "../../../components/buttons";
import { iconSize, radius, shadow } from "../../../design-system";
import { WalletUIStatesProvider } from "../../../evm/providers/wallet-ui-states-provider";
import {
  widemodalMaxHeight,
  modalMaxWidthCompact,
  modalMaxWidthWide,
} from "../constants";
import { ConnectModalContent } from "./ConnectModal";
import { useScreen } from "./screen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useWallets } from "@thirdweb-dev/react-core";
import { DynamicHeight } from "../../../components/DynamicHeight";
import { CustomThemeProvider } from "../../../design-system/CustomThemeProvider";
import { WelcomeScreen } from "../screens/types";

export const ConnectModalInline = (props: {
  theme: "light" | "dark";
  title?: string;
  className?: string;
  modalSize: "wide" | "compact";
  themeOptions?: ThemeOptions;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  welcomeScreen?: WelcomeScreen;
}) => {
  const { screen, setScreen, initialScreen } = useScreen();
  const walletConfigs = useWallets();
  const modalSize =
    isMobile() || walletConfigs.length === 1 ? "compact" : props.modalSize;

  const content = (
    <>
      <ConnectModalContent
        initialScreen={initialScreen}
        screen={screen}
        setScreen={setScreen}
      />

      {/* close icon */}
      <CrossContainer>
        <IconButton variant="secondary" type="button" aria-label="Close">
          <Cross2Icon
            style={{
              width: iconSize.md,
              height: iconSize.md,
              color: "inherit",
            }}
          />
        </IconButton>
      </CrossContainer>
    </>
  );

  return (
    <WalletUIStatesProvider
      theme={props.theme}
      modalSize={modalSize}
      title={props.title}
      themeOptions={props.themeOptions}
      termsOfServiceUrl={props.termsOfServiceUrl}
      privacyPolicyUrl={props.privacyPolicyUrl}
      welcomeScreen={props.welcomeScreen}
    >
      <CustomThemeProvider
        theme={props.theme}
        themeOptions={props.themeOptions}
      >
        <ConnectModalInlineContainer
          className={props.className}
          style={{
            height: modalSize === "compact" ? "auto" : widemodalMaxHeight,
            maxWidth:
              modalSize === "compact"
                ? modalMaxWidthCompact
                : modalMaxWidthWide,
          }}
        >
          {props.modalSize === "compact" ? (
            <DynamicHeight> {content} </DynamicHeight>
          ) : (
            content
          )}
        </ConnectModalInlineContainer>
      </CustomThemeProvider>
    </WalletUIStatesProvider>
  );
};

const ConnectModalInlineContainer = styled.div<{ theme?: Theme }>`
  background: ${(p) => p.theme.colors.base1};
  color: ${(p) => p.theme.colors.primaryText};
  transition: background 0.2s ease;
  border-radius: ${radius.xl};
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${shadow.lg};
  position: relative;
  border: 1px solid ${(p) => p.theme.colors.base3};
  line-height: 1;
  overflow: hidden;
`;
