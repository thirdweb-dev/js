import type { ThirdwebClient } from "../../../../../client/client.js";
import { resolveScheme } from "../../../../../utils/ipfs.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";

export function WithHeader(props: {
  children: React.ReactNode;
  title: string | undefined;
  description: string | undefined;
  image: string | undefined;
  client: ThirdwebClient;
}) {
  const theme = useCustomTheme();

  return (
    <Container flex="column">
      {/* image */}
      {props.image && (
        <div
          className="tw-header-image"
          style={{
            aspectRatio: "16/9",
            backgroundColor: theme.colors.tertiaryBg,
            backgroundImage: `url(${getUrl(props.client, props.image)})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: `${radius.md} ${radius.md} 0 0`,
            marginBottom: spacing.xxs,
            overflow: "hidden",
            width: "100%",
          }}
        />
      )}

      <Container flex="column" px="md">
        <Spacer y="md" />

        {(props.title || props.description) && (
          <>
            {/* title */}
            {props.title && (
              <Text color="primaryText" size="lg" weight={500} trackingTight>
                {props.title}
              </Text>
            )}

            {/* Description */}
            {props.description && (
              <>
                <Spacer y="xxs" />
                <Text color="secondaryText" size="sm" multiline>
                  {props.description}
                </Text>
              </>
            )}

            <Spacer y="md" />
          </>
        )}

        {props.children}
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
