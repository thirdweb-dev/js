import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { TokenWithPrices } from "../../../../../bridge/index.js";
import type { BridgeChain } from "../../../../../bridge/types/Chain.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Text } from "../../components/text.js";
import { cleanedChainName } from "../swap-widget/utils.js";

export function SelectedTokenButton(props: {
  selectedToken:
    | {
        data: TokenWithPrices | undefined;
        isFetching: boolean;
        isError: boolean;
      }
    | undefined;
  client: ThirdwebClient;
  onSelectToken: () => void;
  chain: BridgeChain | undefined;
}) {
  const theme = useCustomTheme();
  return (
    <Button
      variant="ghost-solid"
      hoverBg="secondaryButtonBg"
      fullWidth
      onClick={props.onSelectToken}
      gap="sm"
      style={{
        borderBottom: `1px dashed ${theme.colors.borderColor}`,
        justifyContent: "space-between",
        paddingInline: spacing.md,
        paddingBlock: spacing.md,
        borderRadius: 0,
      }}
    >
      <Container gap="sm" flex="row" center="y">
        {/* icons */}
        <Container relative color="secondaryText">
          {/* token icon */}
          {props.selectedToken && !props.selectedToken.isError ? (
            <Img
              key={props.selectedToken?.data?.iconUri}
              src={
                props.selectedToken?.data === undefined
                  ? undefined
                  : props.selectedToken.data.iconUri || ""
              }
              client={props.client}
              width="40"
              height="40"
              fallback={
                <Container
                  style={{
                    background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                    borderRadius: radius.full,
                    width: "40px",
                    height: "40px",
                  }}
                />
              }
              style={{
                objectFit: "cover",
                borderRadius: radius.full,
              }}
            />
          ) : (
            <Container
              style={{
                border: `1px solid ${theme.colors.borderColor}`,
                background: `linear-gradient(45deg, white, ${theme.colors.accentText})`,
                borderRadius: radius.full,
                width: "40px",
                height: "40px",
              }}
            />
          )}

          {/* chain icon */}
          {props.chain && (
            <Container
              bg="modalBg"
              style={{
                padding: "2px",
                position: "absolute",
                bottom: -2,
                right: -2,
                display: "flex",
                borderRadius: radius.full,
              }}
            >
              <Img
                src={props.chain?.icon}
                client={props.client}
                width={iconSize.sm}
                height={iconSize.sm}
                style={{
                  borderRadius: radius.full,
                }}
              />
            </Container>
          )}
        </Container>

        {/* token symbol and chain name */}
        {props.selectedToken && !props.selectedToken.isError ? (
          <Container flex="column" style={{ gap: "3px" }}>
            {props.selectedToken?.isFetching ? (
              <Skeleton width="60px" height={fontSize.md} />
            ) : (
              <Text size="md" color="primaryText" weight={500}>
                {props.selectedToken?.data?.symbol}
              </Text>
            )}

            {props.chain ? (
              <Text
                size="xs"
                color="secondaryText"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cleanedChainName(props.chain.name)}
              </Text>
            ) : (
              <Skeleton width="140px" height={fontSize.sm} />
            )}
          </Container>
        ) : (
          <Container flex="column" style={{ gap: "3px" }}>
            <Text size="md" color="primaryText" weight={500}>
              Select Token
            </Text>
            <Text size="xs" color="secondaryText">
              Required
            </Text>
          </Container>
        )}
      </Container>
      <Container
        color="secondaryText"
        flex="row"
        center="both"
        borderColor="borderColor"
        style={{
          borderRadius: radius.full,
          borderWidth: 1,
          borderStyle: "solid",
          padding: spacing.xs,
        }}
      >
        <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
      </Container>
    </Button>
  );
}
