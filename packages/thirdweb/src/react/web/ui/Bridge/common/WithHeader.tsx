import type { ThirdwebClient } from "../../../../../client/client.js";
import { resolveScheme } from "../../../../../utils/ipfs.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../../core/design-system/index.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import type { UIOptions } from "../BridgeOrchestrator.js";

export function WithHeader({
  children,
  uiOptions,
  defaultTitle,
  client,
}: {
  children: React.ReactNode;
  uiOptions: UIOptions;
  defaultTitle: string;
  client: ThirdwebClient;
}) {
  const theme = useCustomTheme();
  return (
    <Container flex="column">
      {/* image */}
      {uiOptions.metadata?.image && (
        <div
          style={{
            width: "100%",
            borderRadius: `${radius.md} ${radius.md} 0 0`,
            overflow: "hidden",
            aspectRatio: "16/9",
            backgroundColor: theme.colors.tertiaryBg,
            backgroundImage: `url(${resolveScheme({
              client,
              uri: uiOptions.metadata.image,
            })})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <Container flex="column" px="lg">
        <Spacer y="lg" />

        {/* title */}
        <Text size="lg" color="primaryText" weight={700}>
          {uiOptions.metadata?.title || defaultTitle}
        </Text>

        {/* Description */}
        {uiOptions.metadata?.description && (
          <>
            <Spacer y="xs" />
            <Text size="sm" color="secondaryText">
              {uiOptions.metadata?.description}
            </Text>
          </>
        )}

        <Spacer y="lg" />
        {children}
      </Container>
    </Container>
  );
}
