import { keyframes } from "@emotion/react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { spacing } from "../../../../core/design-system/index.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Link } from "../../components/text.js";
import { Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import type { ConnectButton_connectModalOptions } from "../ConnectButtonProps.js";
import { TOS } from "../Modal/TOS.js";
import { PoweredByThirdweb } from "../PoweredByTW.js";
import { GlobeIcon } from "../icons/GlobalIcon.js";
import type { ConnectLocale } from "../locale/types.js";

/**
 * @internal
 */
export function StartScreen(props: {
  connectLocale: ConnectLocale;
  connectModal: Omit<ConnectButton_connectModalOptions, "size"> & {
    size: "compact" | "wide";
  };
  client: ThirdwebClient;
}) {
  const WelcomeScreen = props.connectModal.welcomeScreen;
  if (WelcomeScreen) {
    if (typeof WelcomeScreen === "function") {
      return <WelcomeScreen />;
    }
  }

  const title =
    (typeof WelcomeScreen === "object" ? WelcomeScreen?.title : undefined) ||
    props.connectLocale.welcomeScreen.defaultTitle;

  const subtitle =
    (typeof WelcomeScreen === "object" ? WelcomeScreen?.subtitle : undefined) ||
    props.connectLocale.welcomeScreen.defaultSubtitle;

  const img =
    typeof WelcomeScreen === "object" ? WelcomeScreen?.img : undefined;

  const showTOS =
    props.connectModal.termsOfServiceUrl || props.connectModal.privacyPolicyUrl;

  return (
    <Container fullHeight animate="fadein" flex="column">
      <Container
        expand
        flex="column"
        center="both"
        style={{
          minHeight: "300px",
        }}
        p="lg"
      >
        <Container flex="row" center="x">
          {img ? (
            <Img
              src={img.src}
              width={img.width ? String(img.width) : undefined}
              height={img.height ? String(img.height) : undefined}
              client={props.client}
            />
          ) : (
            <GlobalContainer>
              <GlobeIcon size={"150"} />
            </GlobalContainer>
          )}
        </Container>

        <Spacer y="xxl" />

        <Text center color="primaryText" weight={600} multiline>
          {title}
        </Text>

        <Spacer y="md" />

        <Text
          color="secondaryText"
          multiline
          style={{
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>

        <Spacer y="lg" />

        <Link
          target="_blank"
          center
          href="https://blog.thirdweb.com/web3-wallet/"
        >
          {props.connectLocale.newToWallets}
        </Link>
      </Container>

      <Container py="lg" flex="column" gap="lg">
        <div>
          {showTOS && (
            <TOS
              termsOfServiceUrl={props.connectModal.termsOfServiceUrl}
              privacyPolicyUrl={props.connectModal.privacyPolicyUrl}
              locale={props.connectLocale.agreement}
            />
          )}

          {props.connectModal.showThirdwebBranding !== false && (
            <Container
              style={{
                paddingTop: spacing.xl,
              }}
            >
              <PoweredByThirdweb />
            </Container>
          )}
        </div>
      </Container>
    </Container>
  );
}

const floatingAnimation = keyframes`
  from {
    transform: translateY(4px);
  }
  to {
    transform: translateY(-4px);
  }
`;

const GlobalContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.accentText,
    filter: `drop-shadow(0px 6px 10px ${theme.colors.accentText})`,
    animation: `${floatingAnimation} 2s ease infinite alternate`,
  };
});
