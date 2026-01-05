"use client";
import { useState } from "react";
import { darkTheme, lightTheme, SwapWidget } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { cn } from "@/lib/utils";
import { buildSwapIframeUrl } from "./buildSwapIframeUrl";
import { CodeGen } from "./code";
import type { SwapWidgetPlaygroundOptions } from "./types";

type Tab = "ui" | "code";

export function RightSection(props: { options: SwapWidgetPlaygroundOptions }) {
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
            name: "UI",
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
        {previewTab === "ui" &&
          (props.options.integrationType === "iframe" ? (
            <iframe
              src={buildSwapIframeUrl(props.options, "preview")}
              height="700px"
              width="100%"
              title="Swap Widget"
              className="fade-in-0 animate-in rounded-xl duration-500"
              style={{
                border: "0",
              }}
            />
          ) : (
            <SwapWidget
              client={THIRDWEB_CLIENT}
              theme={themeObj}
              prefill={props.options.prefill}
              currency={props.options.currency}
              showThirdwebBranding={props.options.showThirdwebBranding}
              key={JSON.stringify({
                prefill: props.options.prefill,
              })}
              persistTokenSelections={false}
            />
          ))}

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
      <div className="flex justify-start gap-1 rounded-lg border bg-card p-2 shadow-md md:inline-flex">
        {props.tabs.map((tab) => (
          <Button
            className={cn(
              "gap-2 px-4 text-base",
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
