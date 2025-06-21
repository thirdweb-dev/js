import { useRef } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { fontSize } from "../../../../../../core/design-system/index.js";
import { Container } from "../../../../components/basic.js";
import { Input } from "../../../../components/formElements.js";
import { Spacer } from "../../../../components/Spacer.js";
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

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      {/* Input */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: TODO */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: TODO */}
      <div
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        <Container
          center="both"
          flex="row"
          gap="xs"
          style={{
            flexWrap: "nowrap",
          }}
        >
          <Input
            data-placeholder={props.value === ""}
            disabled={props.freezeAmount}
            inputMode="decimal"
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
            onClick={(e) => {
              // put cursor at the end of the input
              if (props.value === "") {
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                );
              }
            }}
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0"
            ref={inputRef}
            style={{
              border: "none",
              borderRadius: "0",
              boxShadow: "none",
              fontSize: getBuyTokenAmountFontSize(props.value),
              fontWeight: 600,
              maxWidth: "calc(100% - 100px)",
              padding: "0",
              paddingBlock: "2px",
              textAlign: "right",
              width: getWidth(),
            }}
            tabIndex={-1}
            type="text"
            value={props.value || "0"}
            variant="outline"
          />
          <TokenSymbol
            chain={props.chain}
            color="secondaryText"
            size="lg"
            token={props.token}
          />
        </Container>
      </div>

      <Container
        center="both"
        flex="row"
        style={{
          height: fontSize.xl,
        }}
      >
        <FiatValue
          chain={props.chain}
          client={props.client}
          size="md"
          token={props.token}
          tokenAmount={props.value}
        />
      </Container>

      {!props.hideTokenSelector && (
        <>
          <Spacer y="md" />

          {/* Token / Chain selector */}
          <Container center="x" flex="row">
            <TokenRow
              chain={props.chain}
              client={props.client}
              freezeChainAndToken={props.freezeChainAndToken}
              onSelectToken={props.onSelectToken}
              token={props.token}
            />
          </Container>
        </>
      )}
    </Container>
  );
}
