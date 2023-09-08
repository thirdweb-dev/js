import { ThemeProvider } from "@emotion/react";
import { Theme } from "../../../design-system";
import styled from "@emotion/styled";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CrossContainer } from "../../../components/Modal";
import { IconButton } from "../../../components/buttons";
import {
  lightTheme,
  darkTheme,
  iconSize,
  radius,
  shadow,
} from "../../../design-system";
import { WalletUIStatesProvider } from "../../../evm/providers/wallet-ui-states-provider";
import {
  modalMaxHeight,
  modalMaxWidthCompact,
  modalMaxWidthWide,
} from "../constants";
import { ConnectModalContent } from "./ConnectModal";
import { useScreen } from "./screen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useWallets } from "@thirdweb-dev/react-core";

export const ConnectModalInline = (props: {
  theme: "light" | "dark";
  title?: string;
  className?: string;
  modalSize: "wide" | "compact";
}) => {
  const { screen, setScreen, initialScreen } = useScreen();
  const walletConfigs = useWallets();
  const modalSize =
    isMobile() || walletConfigs.length === 1 ? "compact" : props.modalSize;

  return (
    <WalletUIStatesProvider
      theme={props.theme}
      modalSize={modalSize}
      title={props.title}
    >
      <ThemeProvider theme={props.theme === "light" ? lightTheme : darkTheme}>
        <ConnectModalInlineContainer
          className={props.className}
          style={{
            height: modalSize === "compact" ? "auto" : modalMaxHeight,
            maxWidth:
              modalSize === "compact"
                ? modalMaxWidthCompact
                : modalMaxWidthWide,
          }}
        >
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
        </ConnectModalInlineContainer>
      </ThemeProvider>
    </WalletUIStatesProvider>
  );
};

const ConnectModalInlineContainer = styled.div<{ theme?: Theme }>`
  background: ${(p) => p.theme.bg.base};
  transition: background 0.2s ease;
  border-radius: ${radius.xl};
  width: 100%;
  box-sizing: border-box;
  box-shadow: ${shadow.lg};
  position: relative;
  border: 1px solid ${(p) => p.theme.bg.elevatedHover};
  line-height: 1;
`;
