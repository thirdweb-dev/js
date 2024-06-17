import { keyframes } from "@emotion/react";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { spacing } from "../../../../core/design-system/index.js";
import { useConnectUI } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Link } from "../../components/text.js";
import { Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import { TOS } from "../Modal/TOS.js";
import { PoweredByThirdweb } from "../PoweredByTW.js";
import { GlobeIcon } from "../icons/GlobalIcon.js";

/**
 * @internal
 */
export function StartScreen() {
  const { connectLocale: locale, connectModal, client } = useConnectUI();

  const WelcomeScreen = connectModal.welcomeScreen;
  if (WelcomeScreen) {
    if (typeof WelcomeScreen === "function") {
      return <WelcomeScreen />;
    }
  }

  const title =
    (typeof WelcomeScreen === "object" ? WelcomeScreen?.title : undefined) ||
    locale.welcomeScreen.defaultTitle;

  const subtitle =
    (typeof WelcomeScreen === "object" ? WelcomeScreen?.subtitle : undefined) ||
    locale.welcomeScreen.defaultSubtitle;

  const img =
    typeof WelcomeScreen === "object" ? WelcomeScreen?.img : undefined;

  const showTOS =
    connectModal.termsOfServiceUrl || connectModal.privacyPolicyUrl;

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
              client={client}
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
          {locale.newToWallets}
        </Link>
      </Container>

      <Container py="lg" flex="column" gap="lg">
        <div>
          {showTOS && (
            <TOS
              termsOfServiceUrl={connectModal.termsOfServiceUrl}
              privacyPolicyUrl={connectModal.privacyPolicyUrl}
            />
          )}

          {connectModal.showThirdwebBranding !== false && (
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
