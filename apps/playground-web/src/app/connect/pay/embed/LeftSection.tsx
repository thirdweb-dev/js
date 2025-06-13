"use client";

import { CustomRadioGroup } from "@/components/ui/CustomRadioGroup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCardIcon,
  ExternalLinkIcon,
  FuelIcon,
  PaletteIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { type Address, isAddress } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { cn } from "../../../../lib/utils";
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

  const [tokenAddress, setTokenAddress] = useState<string>(
    payOptions.buyTokenAddress || "",
  );

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection
        title="Payment Options"
        icon={CreditCardIcon}
        defaultOpen
      >
        <div className="flex flex-col gap-6 pt-5">
          <section className="flex flex-col gap-3">
            <Label htmlFor="pay-mode">Widget</Label>
            <CustomRadioGroup
              id="pay-mode"
              options={[
                { value: "buy", label: "Buy" },
                { value: "checkout", label: "Checkout" },
                { value: "transaction", label: "Transaction" },
              ]}
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
              value={payOptions.widget || "buy"}
            />
          </section>

          {/* Conditional form fields based on selected mode */}
          <div className="mt-4">
            {/* Fund Wallet Mode Options */}
            {(!payOptions.widget || payOptions.widget === "buy") && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="buy-token-amount">Amount</Label>
                    <Input
                      id="buy-token-amount"
                      placeholder="0.01"
                      className="bg-card"
                      value={payOptions.buyTokenAmount || ""}
                      onChange={(e) =>
                        setOptions((v) => ({
                          ...v,
                          payOptions: {
                            ...v.payOptions,
                            buyTokenAmount: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  {/* Chain selection */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fund-wallet-chain-id">Chain ID</Label>
                    <Input
                      id="fund-wallet-chain-id"
                      type="number"
                      placeholder="1 (Ethereum)"
                      className="bg-card"
                      value={payOptions.buyTokenChain?.id || ""}
                      onChange={(e) => {
                        const chainId = Number.parseInt(e.target.value);
                        if (!Number.isNaN(chainId)) {
                          const chain = defineChain(chainId);
                          setOptions((v) => ({
                            ...v,
                            payOptions: {
                              ...v.payOptions,
                              buyTokenChain: chain,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Token selection for fund_wallet mode */}
                <div className="flex flex-col gap-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor="token-address">Token Address</Label>
                        <Input
                          id="token-address"
                          placeholder="0x..."
                          value={payOptions.buyTokenAddress}
                          onChange={(e) => {
                            setOptions((v) => ({
                              ...v,
                              payOptions: {
                                ...v.payOptions,
                                buyTokenAddress: e.target.value as Address,
                              },
                            }));
                          }}
                          className={cn("bg-card")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Payment Mode Options */}
            {payOptions.widget === "checkout" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="seller-address">Seller Address</Label>
                  <Input
                    id="seller-address"
                    placeholder="0x..."
                    className="bg-card"
                    value={payOptions.sellerAddress || ""}
                    onChange={(e) => {
                      setOptions((v) => ({
                        ...v,
                        payOptions: {
                          ...v.payOptions,
                          sellerAddress: e.target.value as Address,
                        },
                      }));
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="payment-amount">Price</Label>
                    <Input
                      id="payment-amount"
                      placeholder="0.01"
                      className="bg-card"
                      value={payOptions.buyTokenAmount || ""}
                      onChange={(e) =>
                        setOptions((v) => ({
                          ...v,
                          payOptions: {
                            ...v.payOptions,
                            buyTokenAmount: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  {/* Chain selection */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="direct-payment-chain-id">Chain ID</Label>
                    <Input
                      id="direct-payment-chain-id"
                      type="number"
                      placeholder="1 (Ethereum)"
                      className="bg-card"
                      value={payOptions.buyTokenChain?.id || ""}
                      onChange={(e) => {
                        const chainId = Number.parseInt(e.target.value);
                        if (!Number.isNaN(chainId)) {
                          const chain = defineChain(chainId);
                          setOptions((v) => ({
                            ...v,
                            payOptions: {
                              ...v.payOptions,
                              buyTokenChain: chain,
                            },
                          }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Token selection for direct_payment mode - shares state with fund_wallet mode */}
                <div className="flex flex-col gap-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor="token-address">Token Address</Label>
                        <Input
                          id="token-address"
                          placeholder="0x..."
                          value={tokenAddress}
                          onChange={(e) => setTokenAddress(e.target.value)}
                          className={cn("bg-card")}
                        />
                      </div>
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

      <CollapsibleSection title="Metadata Options" icon={Settings2Icon}>
        <div className="flex flex-col gap-6 pt-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            {/* Modal title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="modal-title">Title</Label>
              <Input
                id="modal-title"
                placeholder="Product name"
                className="bg-card"
                value={options.payOptions.title}
                onChange={(e) =>
                  setOptions((v) => ({
                    ...v,
                    payOptions: {
                      ...payOptions,
                      title: e.target.value,
                    },
                  }))
                }
              />
            </div>

            {/* Modal Title Icon */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="modal-title">Image</Label>
              <Input
                id="modal-title"
                placeholder="https://..."
                className="bg-card"
                value={options.payOptions.image}
                onChange={(e) =>
                  setOptions((v) => ({
                    ...v,
                    payOptions: {
                      ...payOptions,
                      image: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          {/* Modal description */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="modal-description">Image</Label>
            <Input
              id="modal-description"
              placeholder="Your own description here"
              className="bg-card"
              value={options.payOptions.description}
              onChange={(e) =>
                setOptions((v) => ({
                  ...v,
                  payOptions: {
                    ...payOptions,
                    description: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Appearance" icon={PaletteIcon}>
        {/* Theme */}
        <section className="flex flex-col gap-3 pt-6">
          <Label htmlFor="theme"> Theme </Label>
          <CustomRadioGroup
            id="theme"
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            onValueChange={setThemeType}
            value={theme.type}
          />
        </section>

        <div className="h-6" />

        {/* Colors */}
        <ColorFormGroup
          theme={options.theme}
          onChange={(newTheme) => {
            setOptions((v) => ({
              ...v,
              theme: newTheme,
            }));
          }}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Sponsor gas fees" icon={FuelIcon}>
        <div className="mt-4 flex items-start gap-6">
          <div className="flex flex-col gap-2">
            <p className="">
              Abstract away gas fees for users of your app by enabling ERC-4337
              Account Abstraction
            </p>

            <Link
              href="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
              target="_blank"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
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
