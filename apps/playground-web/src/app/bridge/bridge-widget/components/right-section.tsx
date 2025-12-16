"use client";
import { useState } from "react";
import { BridgeWidget, darkTheme, lightTheme } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { cn } from "@/lib/utils";
import { buildIframeUrl } from "./buildIframeUrl";
import { CodeGen } from "./code";
import type { BridgeWidgetPlaygroundOptions } from "./types";

type Tab = "ui" | "code";

export function RightSection(props: {
  options: BridgeWidgetPlaygroundOptions;
}) {
  const [previewTab, _setPreviewTab] = useState<Tab>(() => {
    return "ui";
  });

  function setPreviewTab(tab: "ui" | "code") {
    _setPreviewTab(tab);
  }

  const themeObj =
    props.options.theme.type === "dark"
      ? darkTheme({
          colors: props.options.theme.darkColorOverrides,
        })
      : lightTheme({
          colors: props.options.theme.lightColorOverrides,
        });

  return (
    <div className="flex shrink-0 flex-col gap-4 xl:sticky xl:top-0 xl:max-h-[100vh] xl:w-[764px]">
      <TabButtons
        tabs={[
          {
            isActive: previewTab === "ui",
            name: "Preview",
            onClick: () => setPreviewTab("ui"),
          },
          {
            isActive: previewTab === "code",
            name: "Code",
            onClick: () => setPreviewTab("code"),
          },
        ]}
      />

      <div
        className={cn(
          "relative flex min-h-[300px] grow justify-center rounded-lg",
          previewTab !== "code" && "items-center",
        )}
      >
        {previewTab === "ui" && props.options.integrationType !== "iframe" && (
          <BridgeWidget
            className="shadow-xl"
            client={THIRDWEB_CLIENT}
            theme={themeObj}
            buy={
              props.options.prefill?.buyToken
                ? {
                    chainId: props.options.prefill.buyToken.chainId,
                    tokenAddress: props.options.prefill.buyToken.tokenAddress,
                    amount: props.options.prefill.buyToken.amount,
                  }
                : undefined
            }
            swap={{
              persistTokenSelections: false,
              prefill: {
                buyToken: props.options.prefill?.buyToken
                  ? {
                      chainId: props.options.prefill.buyToken.chainId,
                      tokenAddress: props.options.prefill.buyToken.tokenAddress,
                      amount: props.options.prefill.buyToken.amount,
                    }
                  : undefined,
                sellToken: props.options.prefill?.sellToken
                  ? {
                      chainId: props.options.prefill.sellToken.chainId,
                      tokenAddress:
                        props.options.prefill.sellToken.tokenAddress,
                      amount: props.options.prefill.sellToken.amount,
                    }
                  : undefined,
              },
            }}
            currency={props.options.currency}
            showThirdwebBranding={props.options.showThirdwebBranding}
            key={JSON.stringify(props.options.prefill)}
          />
        )}

        {previewTab === "ui" && props.options.integrationType === "iframe" && (
          <iframe
            src={buildIframeUrl(props.options, "preview")}
            height="750px"
            width="100%"
            title="Bridge Widget"
            className="fade-in-0 duration-500 animate-in rounded-xl"
            style={{
              border: "0",
            }}
          />
        )}

        {previewTab === "code" && <CodeGen options={props.options} />}
      </div>
    </div>
  );
}

function TabButtons(props: {
  tabs: Array<{
    name: string;
    isActive: boolean;
    onClick: () => void;
  }>;
}) {
  return (
    <div>
      <div className="inline-flex justify-start gap-1 rounded-lg border bg-card p-1.5">
        {props.tabs.map((tab) => (
          <Button
            className={cn(
              "gap-2 px-4",
              tab.isActive
                ? "bg-accent text-foreground"
                : "bg-transparent text-muted-foreground",
            )}
            key={tab.name}
            onClick={tab.onClick}
            variant="ghost"
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
