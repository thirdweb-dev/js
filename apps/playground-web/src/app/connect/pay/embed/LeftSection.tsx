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
import { CustomRadioGroup } from "@/components/ui/CustomRadioGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const payModeId = useId();
  const buyTokenAmountId = useId();
  const buyTokenChainId = useId();
  const tokenAddressId = useId();
  const sellerAddressId = useId();
  const paymentAmountId = useId();
  const directPaymentChainId = useId();
  const modalTitleId = useId();
  const modalTitleIconId = useId();
  const modalDescriptionId = useId();
  const themeId = useId();
  const cryptoPaymentId = useId();
  const cardPaymentId = useId();

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

          {/* Conditional form fields based on selected mode */}
          <div className="mt-4">
            {/* Fund Wallet Mode Options */}
            {(!payOptions.widget || payOptions.widget === "buy") && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
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

                  {/* Chain selection */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={buyTokenChainId}>Chain ID</Label>
                    <Input
                      className="bg-card"
                      id={buyTokenChainId}
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
                      placeholder="1 (Ethereum)"
                      type="text"
                      value={payOptions.buyTokenChain?.id || ""}
                    />
                  </div>
                </div>

                {/* Token selection for fund_wallet mode */}
                <div className="flex flex-col gap-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor={tokenAddressId}>Token Address</Label>
                        <Input
                          className={cn("bg-card")}
                          id={tokenAddressId}
                          onChange={(e) => {
                            setOptions((v) => ({
                              ...v,
                              payOptions: {
                                ...v.payOptions,
                                buyTokenAddress: e.target.value as Address,
                              },
                            }));
                          }}
                          placeholder="0x..."
                          value={payOptions.buyTokenAddress}
                        />
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex flex-col gap-3 pt-4">
                      <Label>Payment Methods</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={payOptions.paymentMethods.includes(
                              "crypto",
                            )}
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
                </div>
              </div>
            )}

            {/* Direct Payment Mode Options */}
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
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

                  {/* Chain selection */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={directPaymentChainId}>Chain ID</Label>
                    <Input
                      className="bg-card"
                      id={directPaymentChainId}
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
                      placeholder="1 (Ethereum)"
                      type="number"
                      value={payOptions.buyTokenChain?.id || ""}
                    />
                  </div>
                </div>

                {/* Token selection for direct_payment mode - shares state with fund_wallet mode */}
                <div className="flex flex-col gap-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                      <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor={tokenAddressId}>Token Address</Label>
                        <Input
                          className={cn("bg-card")}
                          id={tokenAddressId}
                          onChange={(e) => setTokenAddress(e.target.value)}
                          placeholder="0x..."
                          value={tokenAddress}
                        />
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex flex-col gap-3">
                      <Label>Payment Methods</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={payOptions.paymentMethods.includes(
                              "crypto",
                            )}
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
