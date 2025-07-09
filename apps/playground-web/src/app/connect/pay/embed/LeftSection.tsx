"use client";

import {
  CreditCardIcon,
  ExternalLinkIcon,
  FuelIcon,
  PaletteIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useId, useState } from "react";
import type { Address } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { CustomRadioGroup } from "@/components/ui/CustomRadioGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TokenSelector } from "@/components/ui/TokenSelector";
import { THIRDWEB_CLIENT } from "@/lib/client";
import type { TokenMetadata } from "@/lib/types";
import { CollapsibleSection } from "../../sign-in/components/CollapsibleSection";
import { ColorFormGroup } from "../../sign-in/components/ColorFormGroup";
import type { BridgeComponentsPlaygroundOptions } from "../components/types";

export function LeftSection(props: {
  options: BridgeComponentsPlaygroundOptions;
  setOptions: React.Dispatch<
    React.SetStateAction<BridgeComponentsPlaygroundOptions>
  >;
}) {
  const { options, setOptions } = props;
  const { theme, payOptions } = options;
  const setThemeType = (themeType: "dark" | "light") => {
    setOptions((v) => ({
      ...v,
      theme: {
        ...v.theme,
        type: themeType,
      },
    }));
  };

  // Shared state for chain and token selection (used by both Buy and Checkout modes)
  const [selectedChain, setSelectedChain] = useState<number | undefined>(() => {
    return payOptions.buyTokenChain?.id;
  });

  const [selectedToken, setSelectedToken] = useState<
    { chainId: number; address: string } | undefined
  >(() => {
    if (payOptions.buyTokenAddress && payOptions.buyTokenChain?.id) {
      return {
        address: payOptions.buyTokenAddress,
        chainId: payOptions.buyTokenChain.id,
      };
    }
    return undefined;
  });

  const payModeId = useId();
  const buyTokenAmountId = useId();
  const sellerAddressId = useId();
  const paymentAmountId = useId();
  const modalTitleId = useId();
  const modalTitleIconId = useId();
  const modalDescriptionId = useId();
  const themeId = useId();
  const cryptoPaymentId = useId();
  const cardPaymentId = useId();

  const handleChainChange = (chainId: number) => {
    setSelectedChain(chainId);
    // Clear token selection when chain changes
    setSelectedToken(undefined);

    setOptions((v) => ({
      ...v,
      payOptions: {
        ...v.payOptions,
        buyTokenAddress: undefined,
        buyTokenChain: defineChain(chainId), // Clear token when chain changes
      },
    }));
  };

  const handleTokenChange = (token: TokenMetadata) => {
    const newSelectedToken = {
      address: token.address,
      chainId: token.chainId,
    };
    setSelectedToken(newSelectedToken);

    setOptions((v) => ({
      ...v,
      payOptions: {
        ...v.payOptions,
        buyTokenAddress: token.address as Address,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection
        defaultOpen
        icon={CreditCardIcon}
        title="Payment Options"
      >
        <div className="flex flex-col gap-6 pt-5">
          <section className="flex flex-col gap-3">
            <Label htmlFor={payModeId}>Widget</Label>
            <CustomRadioGroup
              id={payModeId}
              onValueChange={(value) => {
                setOptions(
                  (v) =>
                    ({
                      ...v,
                      payOptions: {
                        ...v.payOptions,
                        widget: value as "buy" | "checkout" | "transaction",
                      },
                    }) satisfies BridgeComponentsPlaygroundOptions,
                );
              }}
              options={[
                { label: "Buy", value: "buy" },
                { label: "Checkout", value: "checkout" },
                { label: "Transaction", value: "transaction" },
              ]}
              value={payOptions.widget || "buy"}
            />
          </section>

          {/* Shared Chain and Token Selection - Always visible for Buy and Checkout modes */}
          {(!payOptions.widget ||
            payOptions.widget === "buy" ||
            payOptions.widget === "checkout") && (
            <div className="space-y-4">
              {/* Chain selection */}
              <div className="flex flex-col gap-2">
                <Label>Chain</Label>
                <SingleNetworkSelector
                  chainId={selectedChain}
                  disableTestnets={true}
                  onChange={handleChainChange}
                  placeholder="Select a chain"
                />
              </div>

              {/* Token selection - only show if chain is selected */}
              {selectedChain && (
                <div className="flex flex-col gap-2">
                  <Label>Token</Label>
                  <TokenSelector
                    addNativeTokenIfMissing={true}
                    chainId={selectedChain}
                    client={THIRDWEB_CLIENT}
                    enabled={true}
                    onChange={handleTokenChange}
                    placeholder="Select a token"
                    selectedToken={selectedToken}
                  />
                </div>
              )}
            </div>
          )}

          {/* Mode-specific form fields */}
          <div className="my-2">
            {/* Buy Mode - Amount and Payment Methods */}
            {(!payOptions.widget || payOptions.widget === "buy") && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={buyTokenAmountId}>Amount</Label>
                  <Input
                    className="bg-card"
                    id={buyTokenAmountId}
                    onChange={(e) =>
                      setOptions((v) => ({
                        ...v,
                        payOptions: {
                          ...v.payOptions,
                          buyTokenAmount: e.target.value,
                        },
                      }))
                    }
                    placeholder="0.01"
                    value={payOptions.buyTokenAmount || ""}
                  />
                </div>

                {/* Payment Methods */}
                <div className="flex flex-col gap-3">
                  <Label>Payment Methods</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={payOptions.paymentMethods.includes("crypto")}
                        id={cryptoPaymentId}
                        onCheckedChange={(checked) => {
                          setOptions((v) => ({
                            ...v,
                            payOptions: {
                              ...v.payOptions,
                              paymentMethods: checked
                                ? [
                                    ...v.payOptions.paymentMethods.filter(
                                      (m) => m !== "crypto",
                                    ),
                                    "crypto",
                                  ]
                                : v.payOptions.paymentMethods.filter(
                                    (m) => m !== "crypto",
                                  ),
                            },
                          }));
                        }}
                      />
                      <Label htmlFor={cryptoPaymentId}>Crypto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={payOptions.paymentMethods.includes("card")}
                        id={cardPaymentId}
                        onCheckedChange={(checked) => {
                          setOptions((v) => ({
                            ...v,
                            payOptions: {
                              ...v.payOptions,
                              paymentMethods: checked
                                ? [
                                    ...v.payOptions.paymentMethods.filter(
                                      (m) => m !== "card",
                                    ),
                                    "card",
                                  ]
                                : v.payOptions.paymentMethods.filter(
                                    (m) => m !== "card",
                                  ),
                            },
                          }));
                        }}
                      />
                      <Label htmlFor={cardPaymentId}>Card</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Checkout Mode - Seller Address, Price and Payment Methods */}
            {payOptions.widget === "checkout" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={sellerAddressId}>Seller Address</Label>
                  <Input
                    className="bg-card"
                    id={sellerAddressId}
                    onChange={(e) => {
                      setOptions((v) => ({
                        ...v,
                        payOptions: {
                          ...v.payOptions,
                          sellerAddress: e.target.value as Address,
                        },
                      }));
                    }}
                    placeholder="0x..."
                    value={payOptions.sellerAddress || ""}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={paymentAmountId}>Price</Label>
                  <Input
                    className="bg-card"
                    id={paymentAmountId}
                    onChange={(e) =>
                      setOptions((v) => ({
                        ...v,
                        payOptions: {
                          ...v.payOptions,
                          buyTokenAmount: e.target.value,
                        },
                      }))
                    }
                    placeholder="0.01"
                    value={payOptions.buyTokenAmount || ""}
                  />
                </div>

                {/* Payment Methods */}
                <div className="flex flex-col gap-3">
                  <Label>Payment Methods</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={payOptions.paymentMethods.includes("crypto")}
                        id={`${cryptoPaymentId}-checkout`}
                        onCheckedChange={(checked) => {
                          setOptions((v) => ({
                            ...v,
                            payOptions: {
                              ...v.payOptions,
                              paymentMethods: checked
                                ? [
                                    ...v.payOptions.paymentMethods.filter(
                                      (m) => m !== "crypto",
                                    ),
                                    "crypto",
                                  ]
                                : v.payOptions.paymentMethods.filter(
                                    (m) => m !== "crypto",
                                  ),
                            },
                          }));
                        }}
                      />
                      <Label htmlFor={`${cryptoPaymentId}-checkout`}>
                        Crypto
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={payOptions.paymentMethods.includes("card")}
                        id={`${cardPaymentId}-checkout`}
                        onCheckedChange={(checked) => {
                          setOptions((v) => ({
                            ...v,
                            payOptions: {
                              ...v.payOptions,
                              paymentMethods: checked
                                ? [
                                    ...v.payOptions.paymentMethods.filter(
                                      (m) => m !== "card",
                                    ),
                                    "card",
                                  ]
                                : v.payOptions.paymentMethods.filter(
                                    (m) => m !== "card",
                                  ),
                            },
                          }));
                        }}
                      />
                      <Label htmlFor={`${cardPaymentId}-checkout`}>Card</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Mode Options */}
            {payOptions.widget === "transaction" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label>Transaction</Label>
                  <p className="text-muted-foreground text-sm">
                    This demo uses a ERC1155 NFT claim transaction. Check the
                    code section for the transaction details. You can provide
                    any contract call or transfer here, the price will be
                    automatically inferred from the transaction itself.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection icon={Settings2Icon} title="Metadata Options">
        <div className="flex flex-col gap-6 pt-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            {/* Modal title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={modalTitleId}>Name</Label>
              <Input
                className="bg-card"
                id={modalTitleId}
                onChange={(e) =>
                  setOptions((v) => ({
                    ...v,
                    payOptions: {
                      ...payOptions,
                      title: e.target.value,
                    },
                  }))
                }
                placeholder="Product name"
                value={options.payOptions.title}
              />
            </div>

            {/* Modal Title Icon */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={modalTitleIconId}>Image</Label>
              <Input
                className="bg-card"
                id={modalTitleIconId}
                onChange={(e) =>
                  setOptions((v) => ({
                    ...v,
                    payOptions: {
                      ...payOptions,
                      image: e.target.value,
                    },
                  }))
                }
                placeholder="https://..."
                value={options.payOptions.image}
              />
            </div>
          </div>

          {/* Modal description */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={modalDescriptionId}>Description</Label>
            <Input
              className="bg-card"
              id={modalDescriptionId}
              onChange={(e) =>
                setOptions((v) => ({
                  ...v,
                  payOptions: {
                    ...payOptions,
                    description: e.target.value,
                  },
                }))
              }
              placeholder="Your own description here"
              value={options.payOptions.description}
            />
          </div>
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
            value={theme.type}
          />
        </section>

        <div className="h-6" />

        {/* Colors */}
        <ColorFormGroup
          onChange={(newTheme) => {
            setOptions((v) => ({
              ...v,
              theme: newTheme,
            }));
          }}
          theme={options.theme}
        />

        <div className="my-4 flex items-center gap-2">
          <Checkbox
            checked={payOptions.showThirdwebBranding}
            id={"branding"}
            onCheckedChange={(checked) => {
              setOptions((v) => ({
                ...v,
                payOptions: {
                  ...v.payOptions,
                  showThirdwebBranding: checked === true,
                },
              }));
            }}
          />
          <Label htmlFor={"branding"}>Show Branding</Label>
        </div>
      </CollapsibleSection>

      <CollapsibleSection icon={FuelIcon} title="Sponsor gas fees">
        <div className="mt-4 flex items-start gap-6">
          <div className="flex flex-col gap-2">
            <p className="">
              Abstract away gas fees for users of your app by enabling ERC-4337
              Account Abstraction
            </p>

            <Link
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              href="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
              target="_blank"
            >
              Learn more about Account Abstraction
              <ExternalLinkIcon className="size-4" />
            </Link>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
