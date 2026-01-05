"use client";

import { CoinsIcon, PaletteIcon } from "lucide-react";
import type React from "react";
import { useId } from "react";
import { getAddress, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { CollapsibleSection } from "@/app/wallets/sign-in/components/CollapsibleSection";
import { ColorFormGroup } from "@/app/wallets/sign-in/components/ColorFormGroup";
import { BridgeNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { CustomRadioGroup } from "@/components/ui/CustomRadioGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TokenSelector } from "@/components/ui/TokenSelector";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { CurrencySelector } from "../../../../components/blocks/CurrencySelector";
import type { SwapWidgetPlaygroundOptions } from "./types";

export function LeftSection(props: {
  options: SwapWidgetPlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<SwapWidgetPlaygroundOptions>>;
}) {
  const { options, setOptions } = props;
  const setThemeType = (themeType: "dark" | "light") => {
    setOptions((v) => ({
      ...v,
      theme: {
        ...v.theme,
        type: themeType,
      },
    }));
  };

  const themeId = useId();

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection defaultOpen icon={CoinsIcon} title="Token Selection">
        <div className="flex flex-col gap-6 pt-5">
          <section className="flex flex-col gap-3">
            <Label htmlFor="currency">Display Currency</Label>
            <CurrencySelector
              value={options.currency}
              onChange={(currency) => {
                setOptions((v) => ({ ...v, currency }));
              }}
            />
          </section>

          <div className="border-t border-dashed" />

          <TokenFieldset
            title="Sell Token"
            type="sellToken"
            options={options}
            setOptions={setOptions}
          />

          <div className="border-t border-dashed" />

          <TokenFieldset
            title="Buy Token"
            type="buyToken"
            options={options}
            setOptions={setOptions}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection icon={PaletteIcon} title="Appearance">
        {/* Theme */}
        <section className="flex flex-col gap-3 pt-6">
          <Label htmlFor="theme"> Theme </Label>
          <CustomRadioGroup
            id={themeId}
            onValueChange={setThemeType}
            options={[
              { label: "Dark", value: "dark" },
              { label: "Light", value: "light" },
            ]}
            value={options.theme.type}
          />
        </section>

        <div className="h-6" />

        {/* Colors - disabled for iframe */}
        {options.integrationType !== "iframe" && (
          <ColorFormGroup
            onChange={(newTheme) => {
              setOptions((v) => ({
                ...v,
                theme: newTheme,
              }));
            }}
            theme={options.theme}
          />
        )}

        <div className="my-4 flex items-center gap-2">
          <Checkbox
            checked={options.showThirdwebBranding}
            id={"branding"}
            onCheckedChange={(checked) => {
              setOptions((v) => ({
                ...v,
                showThirdwebBranding: checked === true,
              }));
            }}
          />
          <Label htmlFor={"branding"}>Show Branding</Label>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function TokenFieldset(props: {
  type: "buyToken" | "sellToken";
  title: string;
  options: SwapWidgetPlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<SwapWidgetPlaygroundOptions>>;
}) {
  const { options, setOptions } = props;

  const chainId = options.prefill?.[props.type]?.chainId;
  const tokenAddress = options.prefill?.[props.type]?.tokenAddress;

  return (
    <div>
      <h3 className="mb-1 font-medium">{props.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Sets the default token and amount to{" "}
        {props.type === "buyToken" ? "buy" : "sell"} in the widget, <br />
        User can change this default selection in the widget
      </p>
      <div className="space-y-4">
        {/* Chain selection */}
        <div className="space-y-2">
          <Label>Chain</Label>
          <BridgeNetworkSelector
            chainId={chainId}
            onChange={(chainId) => {
              setOptions((v) => ({
                ...v,
                prefill: {
                  ...v.prefill,
                  [props.type]: {
                    ...v.prefill?.[props.type],
                    chainId,
                    tokenAddress: undefined, // clear token selection
                  },
                },
              }));
            }}
            placeholder="Select a chain"
            className="bg-card"
          />
        </div>

        {/* Token selection - only show if chain is selected */}
        <div className="space-y-2">
          <Label>Token</Label>
          <TokenSelector
            chainId={chainId}
            client={THIRDWEB_CLIENT}
            disableAddress
            enabled={true}
            onChange={(token) => {
              setOptions((v) => ({
                ...v,
                prefill: {
                  ...v.prefill,
                  [props.type]: {
                    chainId: token.chainId,
                    tokenAddress: token.address,
                  },
                },
              }));
            }}
            placeholder="Select a token"
            selectedToken={
              tokenAddress && chainId
                ? {
                    address: tokenAddress,
                    chainId: chainId,
                  }
                : chainId
                  ? {
                      address: getAddress(NATIVE_TOKEN_ADDRESS),
                      chainId: chainId,
                    }
                  : undefined
            }
            className="bg-card"
          />
        </div>

        {chainId && (
          <div className="space-y-2">
            <Label> Token Amount</Label>
            <Input
              className="bg-card"
              value={options.prefill?.[props.type]?.amount || ""}
              onChange={(e) => {
                setOptions((v) => {
                  return {
                    ...v,
                    prefill: {
                      ...v.prefill,
                      [props.type]: {
                        ...v.prefill?.[props.type],
                        amount: e.target.value,
                        chainId: chainId,
                      },
                    },
                  };
                });
              }}
              placeholder="0.01"
            />
          </div>
        )}
      </div>
    </div>
  );
}
