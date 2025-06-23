import { keyframes } from "@emotion/react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { spacing } from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Link, Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import { GlobeIcon } from "../icons/GlobalIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import { TOS } from "../Modal/TOS.js";
import { PoweredByThirdweb } from "../PoweredByTW.js";
import type { WelcomeScreen } from "./types.js";

/**
 * @internal
 */
export function StartScreen(props: {
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  welcomeScreen: WelcomeScreen | undefined;
  meta: {
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
}) {
  const WelcomeScreen = props.welcomeScreen;
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

  const showTOS = props.meta.termsOfServiceUrl || props.meta.privacyPolicyUrl;

  return (
    <Container animate="fadein" flex="column" fullHeight>
      <Container
        center="both"
        expand
        flex="column"
        p="lg"
        style={{
          minHeight: "300px",
        }}
      >
        <Container center="x" flex="row">
          {img ? (
            <Img
              client={props.client}
              height={img.height ? String(img.height) : undefined}
              src={img.src}
              width={img.width ? String(img.width) : undefined}
            />
          ) : (
            <GlobalContainer>
              <GlobeIcon size="150" />
            </GlobalContainer>
          )}
        </Container>

        <Spacer y="xxl" />

        <Text center color="primaryText" multiline weight={600}>
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
          center
          href="https://blog.thirdweb.com/web3-wallet/"
          target="_blank"
        >
          {props.connectLocale.newToWallets}
        </Link>
      </Container>

      <Container flex="column" gap="lg" py="lg">
        <div>
          {showTOS && (
            <TOS
              locale={props.connectLocale.agreement}
              privacyPolicyUrl={props.meta.privacyPolicyUrl}
              termsOfServiceUrl={props.meta.termsOfServiceUrl}
            />
          )}

          {props.meta.showThirdwebBranding !== false && (
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
    animation: `${floatingAnimation} 2s ease infinite alternate`,
    color: theme.colors.accentText,
    filter: `drop-shadow(0px 6px 10px ${theme.colors.accentText})`,
  };
});
