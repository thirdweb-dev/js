import { useWalletBalance } from "../../../../../hooks/others/useWalletBalance.js";
import { useActiveAccount } from "../../../../../providers/wallet-provider.js";
import { Container } from "../../../../components/basic.js";
import { Input } from "../../../../components/formElements.js";
import type { Chain } from "../../../../../../chains/types.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { fontSize, iconSize } from "../../../../design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Button } from "../../../../components/buttons.js";
import { TokenSelectorButton } from "./TokenSelector.js";
import { useChainQuery } from "../../../../../hooks/others/useChainQuery.js";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { isMobile } from "../../../../../utils/isMobile.js";
import { ChainIcon } from "../../../../components/ChainIcon.js";
import { Text } from "../../../../components/text.js";

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
          fontWeight: 600,
          textAlign: "center",
        }}
      />

      <Spacer y="md" />

      <Container flex="row" center="x">
        <TokenSelectorButton
          onClick={props.onTokenClick}
          token={props.token}
          tokenIcon={tokenIcon}
          tokenSymbol={tokenSymbol}
          style={{
            padding: 0,
            fontSize: fontSize.sm,
            border: "none",
          }}
        />
      </Container>

      <Spacer y="sm" />

      <Container flex="row" center="x">
        <Button
          variant="outline"
          style={{
            fontSize: fontSize.sm,
            padding: 0,
            border: "none",
          }}
          gap="xxs"
          onClick={props.onChainClick}
        >
          <ChainIcon chain={chainQuery.data} size={iconSize.sm} />
          {chainQuery.data?.name ? (
            <Text size="sm">{chainQuery.data.name}</Text>
          ) : (
            <Skeleton width="90px" height={fontSize.xs} />
          )}
          <Container color="secondaryText">
            <ChevronDownIcon width={iconSize.sm} height={iconSize.sm} />
          </Container>
        </Button>
      </Container>
    </Container>
  );
}
