import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import {
  fontSize,
  iconSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { useChainQuery } from "../../../../../../core/hooks/others/useChainQuery.js";
import { useWalletBalance } from "../../../../../../core/hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../../hooks/wallets/useActiveAccount.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Container } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { TokenInfo } from "../../../defaultTokens.js";
import { GenericWalletIcon } from "../../../icons/GenericWalletIcon.js";
import { formatTokenBalance } from "../../formatTokenBalance.js";
import { type NativeToken, isNativeToken } from "../../nativeToken.js";
import { PayTokenIcon } from "../PayTokenIcon.js";

/**
 * Shows an amount "value" and renders the selected token and chain
 * It also renders the buttons to select the token and chain
 * It also renders the balance of active wallet for the selected token in selected chain
 * @internal
 */
export function PayWithCrypto(props: {
  value: string;
  onSelectToken: () => void;
  chain: Chain;
  token: TokenInfo | NativeToken;
  isLoading: boolean;
  client: ThirdwebClient;
  freezeChainAndTokenSelection?: boolean;
}) {
  const chainQuery = useChainQuery(props.chain);
  const activeAccount = useActiveAccount();

  const balanceQuery = useWalletBalance({
    address: activeAccount?.address,
    chain: props.chain,
    tokenAddress: isNativeToken(props.token) ? undefined : props.token.address,
    client: props.client,
  });

  return (
    <Container
      bg="tertiaryBg"
      borderColor="borderColor"
      flex="row"
      style={{
        borderRadius: radius.md,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: "1px",
        borderStyle: "solid",
        borderBottom: "none",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        minHeight: "64px",
        alignItems: "center",
      }}
    >
      {/* Left */}
      <Button
        variant="ghost"
        onClick={props.onSelectToken}
        gap="sm"
        style={{
          paddingInline: spacing.sm,
          paddingBlock: spacing.sm,
          minWidth: "50%",
          justifyContent: "flex-start",
        }}
        disabled={props.freezeChainAndTokenSelection}
      >
        <PayTokenIcon
          token={props.token}
          chain={props.chain}
          size="md"
          client={props.client}
        />
        <Container flex="column" gap="xxs">
          <Container flex="row" gap="xs" center="y" color="primaryText">
            <TokenSymbol token={props.token} chain={props.chain} size="sm" />
            <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
          </Container>
          {chainQuery.data?.name ? (
            <Text size="xs"> {chainQuery.data.name}</Text>
          ) : (
            <Skeleton width="90px" height={fontSize.xs} />
          )}
        </Container>
      </Button>

      {/* Right */}
      <div
        style={{
          flexGrow: 1,
          flexShrink: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: spacing.xxs,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          justifyContent: "center",
          paddingRight: spacing.sm,
        }}
      >
        {props.isLoading ? (
          <Skeleton width="120px" height={fontSize.md} color="borderColor" />
        ) : (
          <Text
            size="md"
            color={props.value ? "primaryText" : "secondaryText"}
            style={{}}
          >
            {formatNumber(Number(props.value), 4) || "--"}
          </Text>
        )}

        <Container flex="row" gap="xxs" center="y" color="secondaryText">
          <GenericWalletIcon size={fontSize.xs} />
          {balanceQuery.data ? (
            <Text size="xs" color="secondaryText" weight={500}>
              {formatTokenBalance(balanceQuery.data, true)}
            </Text>
          ) : (
            <Skeleton width="70px" height={fontSize.xs} />
          )}
        </Container>
      </div>
    </Container>
  );
}
