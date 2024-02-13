import { keyframes } from "@emotion/react";
import { useContext } from "react";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Link } from "../../components/text.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../../design-system/elements.js";
import { TOS } from "../Modal/TOS.js";
import { Text } from "../../components/text.js";
import { GlobeIcon } from "../icons/GlobalIcon.js";
import { useTWLocale } from "../../../providers/locale-provider.js";
import { ModalConfigCtx } from "../../../providers/wallet-ui-states-provider.js";
import { spacing } from "../../design-system/index.js";
import { PoweredByThirdweb } from "../PoweredByTW.js";

/**
 * @internal
 */
export function StartScreen() {
  const {
    termsOfServiceUrl,
    privacyPolicyUrl,
    welcomeScreen: WelcomeScreen,
    showThirdwebBranding,
  } = useContext(ModalConfigCtx);
  const locale = useTWLocale().connectWallet;

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

  const showTOS = termsOfServiceUrl || privacyPolicyUrl;

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
              termsOfServiceUrl={termsOfServiceUrl}
              privacyPolicyUrl={privacyPolicyUrl}
            />
          )}

          {showThirdwebBranding !== false && (
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
