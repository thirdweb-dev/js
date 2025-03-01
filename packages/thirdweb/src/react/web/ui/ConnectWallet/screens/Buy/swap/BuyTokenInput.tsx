import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { fontSize } from "../../../../../../core/design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Container } from "../../../../components/basic.js";
import { Input } from "../../../../components/formElements.js";
import { TokenRow } from "../../../../components/token/TokenRow.js";
import { TokenSymbol } from "../../../../components/token/TokenSymbol.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { getBuyTokenAmountFontSize } from "../utils.js";
import { FiatValue } from "./FiatValue.js";

/**
 * @internal
 */
export function BuyTokenInput(props: {
  token: ERC20OrNativeToken;
  chain: Chain;
  value: string;
  onChange: (value: string) => void;
  onSelectToken: () => void;
  client: ThirdwebClient;
  hideTokenSelector?: boolean;
  freezeAmount?: boolean;
  freezeChainAndToken?: boolean;
}) {
  const getWidth = () => {
    let chars = props.value.replace(".", "").length;
    const hasDot = props.value.includes(".");
    if (hasDot) {
      chars += 0.3;
    }
    return `calc(${`${Math.max(1, chars)}ch`} + 6px)`;
  };

  return (
    <Container>
      {/* Input */}

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        onClick={(e) => {
          e.currentTarget.querySelector("input")?.focus();
        }}
      >
        <Container
          flex="row"
          center="both"
          gap="xs"
          style={{
            flexWrap: "nowrap",
          }}
        >
          <Input
            variant="outline"
            pattern="^[0-9]*[.,]?[0-9]*$"
            inputMode="decimal"
            tabIndex={-1}
            placeholder="0"
            type="text"
            data-placeholder={props.value === ""}
            value={props.value || "0"}
            disabled={props.freezeAmount}
            onClick={(e) => {
              // put cursor at the end of the input
              if (props.value === "") {
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                );
              }
            }}
            onChange={(e) => {
              let value = e.target.value;

              // Replace comma with period if it exists
              value = value.replace(",", ".");

              if (value.startsWith(".")) {
                value = `0${value}`;
              }

              const numValue = Number(value);
              if (Number.isNaN(numValue)) {
                return;
              }

              if (value.startsWith("0") && !value.startsWith("0.")) {
                props.onChange(value.slice(1));
              } else {
                props.onChange(value);
              }
            }}
            style={{
              border: "none",
              fontSize: getBuyTokenAmountFontSize(props.value),
              boxShadow: "none",
              borderRadius: "0",
              padding: "0",
              paddingBlock: "2px",
              fontWeight: 600,
              textAlign: "right",
              width: getWidth(),
              maxWidth: "calc(100% - 100px)",
            }}
          />
          <TokenSymbol
            token={props.token}
            chain={props.chain}
            size="lg"
            color="secondaryText"
          />
        </Container>
      </div>

      <Container
        flex="row"
        center="both"
        style={{
          height: fontSize.xl,
        }}
      >
        <FiatValue
          tokenAmount={props.value}
          token={props.token}
          chain={props.chain}
          client={props.client}
          size="md"
        />
      </Container>

      {!props.hideTokenSelector && (
        <>
          <Spacer y="md" />

          {/* Token / Chain selector */}
          <Container flex="row" center="x">
            <TokenRow
              token={props.token}
              chain={props.chain}
              client={props.client}
              onSelectToken={props.onSelectToken}
              freezeChainAndToken={props.freezeChainAndToken}
            />
          </Container>
        </>
      )}
    </Container>
  );
}
