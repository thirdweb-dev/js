import { useWalletBalance } from "../../../../../hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../../providers/wallet-provider.js";
import { Container } from "../../../../components/basic.js";
import { Input } from "../../../../components/formElements.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../design-system/index.js";
import { Text } from "../../../../components/text.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Button } from "../../../../components/buttons.js";
import { TokenSelectorButton } from "./TokenSelector.js";
import { useChainQuery } from "../../../../../hooks/others/useChainQuery.js";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ChainIcon } from "../../../../components/ChainIcon.js";
import { isMobile } from "../../../../../utils/isMobile.js";

/**
 * @internal
 */
export function BuyTokenInput(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  value: string;
  onChange: (value: string) => void;
  onTokenClick: () => void;
  onChainClick: () => void;
}) {
  const activeAccount = useActiveAccount();
  const chainQuery = useChainQuery(props.chain);

  const token =
    props.token && !("nativeToken" in props.token) ? props.token : undefined;

  const balanceQuery = useWalletBalance({
    account: activeAccount,
    chain: props.chain,
    tokenAddress: token?.address,
  });

  const tokenSymbol = token?.symbol || balanceQuery.data?.symbol;
  const tokenIcon = token?.icon || chainQuery.data?.icon?.url;

  return (
    <Container>
      <Input
        variant="outline"
        pattern="^[0-9]*[.,]?[0-9]*$"
        inputMode="decimal"
        placeholder="0"
        type="text"
        value={props.value}
        onChange={(e) => {
          let value = e.target.value;
          if (value.startsWith(".")) {
            value = "0" + value;
          }
          const isNum = Number(value);
          if (isNaN(isNum)) {
            return;
          }
          props.onChange(value);
        }}
        style={{
          border: "none",
          fontSize: isMobile() ? "40px" : "50px",
          boxShadow: "none",
          padding: "0",
          textAlign: "center",
        }}
      />

      <Spacer y="xxs" />

      <Container flex="row" center="x">
        {tokenSymbol ? (
          <Text size="sm">{tokenSymbol}</Text>
        ) : (
          <Skeleton width="70px" height={fontSize.sm} />
        )}
      </Container>

      <Spacer y="lg" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: spacing.sm,
        }}
      >
        <Text size="sm"> Buying </Text>
        <Text size="sm"> Network </Text>
      </div>

      <Spacer y="xs" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: spacing.sm,
        }}
      >
        <TokenSelectorButton
          onClick={props.onTokenClick}
          token={props.token}
          tokenIcon={tokenIcon}
          tokenSymbol={tokenSymbol}
          style={{
            padding: spacing.sm,
            fontSize: fontSize.sm,
          }}
        />

        <Button
          variant="outline"
          style={{
            fontSize: fontSize.sm,
            padding: spacing.sm,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          gap="xxs"
          onClick={props.onChainClick}
        >
          <ChainIcon chain={chainQuery.data} size={iconSize.sm} />
          {chainQuery.data?.name ? (
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {chainQuery.data.name}
            </div>
          ) : (
            <Skeleton width="90px" height={fontSize.xs} />
          )}
          <Container color="secondaryText">
            <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
          </Container>
        </Button>
      </div>
    </Container>
  );
}
