"use client";
import { useState } from "react";
import { darkTheme, lightTheme, SwapWidget } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { cn } from "@/lib/utils";
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
        <BackgroundPattern />

        {previewTab === "ui" && (
          <SwapWidget
            client={THIRDWEB_CLIENT}
            theme={themeObj}
            prefill={props.options.prefill}
            currency={props.options.currency}
            showThirdwebBranding={props.options.showThirdwebBranding}
            key={JSON.stringify(props.options)}
            persistTokenSelections={false}
          />
        )}

        {previewTab === "code" && <CodeGen options={props.options} />}
      </div>
    </div>
  );
}

function BackgroundPattern() {
  const color = "hsl(var(--foreground)/15%)";
  return (
    <div
      className="absolute inset-0 z-[-1]"
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 60%)",
      }}
    />
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
