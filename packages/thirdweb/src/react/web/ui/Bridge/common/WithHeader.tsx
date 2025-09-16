import type { ThirdwebClient } from "../../../../../client/client.js";
import { resolveScheme } from "../../../../../utils/ipfs.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
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
  const showTitle = uiOptions.metadata?.title !== "";

  return (
    <Container flex="column">
      {/* image */}
      {uiOptions.metadata?.image && (
        <div
          style={{
            aspectRatio: "16/9",
            backgroundColor: theme.colors.tertiaryBg,
            backgroundImage: `url(${getUrl(client, uiOptions.metadata.image)})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: `${radius.md} ${radius.md} 0 0`,
            overflow: "hidden",
            width: "100%",
          }}
        />
      )}

      <Container flex="column" px="md">
        <Spacer y="md+" />

        {(showTitle || uiOptions.metadata?.description) && (
          <>
            {/* title */}
            {showTitle && (
              <Text color="primaryText" size="lg" weight={600}>
                {uiOptions.metadata?.title || defaultTitle}
              </Text>
            )}

            {/* Description */}
            {uiOptions.metadata?.description && (
              <>
                <Spacer y="xxs" />
                <Text color="secondaryText" size="sm" multiline>
                  {uiOptions.metadata?.description}
                </Text>
              </>
            )}

            <Spacer y="md" />
          </>
        )}

        {children}
      </Container>
    </Container>
  );
}

function getUrl(client: ThirdwebClient, uri: string) {
  if (!uri.startsWith("ipfs://")) {
    return uri;
  }
  return resolveScheme({
    client,
    uri,
  });
}
