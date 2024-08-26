import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Input } from "@/components/ui/input";
import { SearchIcon, SectionIcon } from "lucide-react";
import { useState } from "react";
import { type Theme, darkTheme, lightTheme } from "thirdweb/react";
import { ColorInput } from "./ColorInput";
import type { ConnectPlaygroundOptions } from "./types";

export function ColorFormGroup(props: {
  connectOptions: ConnectPlaygroundOptions;
  setConnectOptions: React.Dispatch<
    React.SetStateAction<ConnectPlaygroundOptions>
  >;
}) {
  const [search, setSearch] = useState("");
  const { connectOptions, setConnectOptions } = props;

  const themeObj =
    connectOptions.theme.type === "dark"
      ? darkTheme({
          colors: connectOptions.theme.darkColorOverrides,
        })
      : lightTheme({
          colors: connectOptions.theme.lightColorOverrides,
        });

  const colorSectionsToShow = colorSections
    .map((colorSection) => {
      const colors = colorSection.colors.filter((color) =>
        color.label.toLowerCase().includes(search.toLowerCase()),
      );
      return { ...colorSection, colors };
    })
    .filter((colorSection) => colorSection.colors.length > 0);

  return (
    <section className="flex flex-col border rounded-lg bg-muted">
      {/* heading */}
      <div className="p-4 flex items-center gap-4 justify-between border-b">
        <h2 className="text-base font-semibold"> Colors </h2>
        <div className="relative grow max-w-[320px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-9 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ScrollShadow
        scrollableClassName="h-[300px] p-2"
        shadowColor="hsl(var(--muted))"
      >
        <div className="flex flex-col gap-2">
          {colorSectionsToShow.map((colorSection) => {
            return (
              <div key={colorSection.section}>
                <h3 className="px-2 flex items-center gap-1.5 font-semibold text-muted-foreground py-3 text-sm">
                  <SectionIcon className="size-4" />
                  {colorSection.section}
                </h3>
                <div className="flex flex-col gap-2 pb-4">
                  {colorSection.colors.map((color) => {
                    return (
                      <label
                        className="cursor-pointer p-2 gap-3 flex items-center hover:bg-secondary rounded-lg transition-colors"
                        key={color.colorId}
                      >
                        <div className="border rounded-full">
                          <ColorInput
                            className="size-10"
                            value={themeObj.colors[color.colorId]}
                            onChange={(value) => {
                              setConnectOptions((v) => {
                                const overridesKey =
                                  v.theme.type === "dark"
                                    ? "darkColorOverrides"
                                    : "lightColorOverrides";

                                return {
                                  ...v,
                                  theme: {
                                    ...v.theme,
                                    [overridesKey]: {
                                      ...v.theme[overridesKey],
                                      [color.colorId]: value,
                                    },
                                  },
                                };
                              });
                            }}
                          />
                        </div>
                        <div>
                          <div>{color.label}</div>
                          <div className="text-xs text-muted-foreground ml-auto font-mono">
                            {themeObj.colors[color.colorId]}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {colorSectionsToShow.length === 0 && (
            <p className="py-14 px-2 text-center text-muted-foreground">
              No colors found
            </p>
          )}
        </div>
      </ScrollShadow>
    </section>
  );
}

const colorSections: Array<{
  section: string;
  colors: Array<{
    colorId: keyof Theme["colors"];
    label: string;
  }>;
}> = [
  {
    section: "General",
    colors: [
      {
        colorId: "modalBg",
        label: "Modal Background",
      },
      {
        colorId: "borderColor",
        label: "Border",
      },
      {
        colorId: "accentText",
        label: "Accent",
      },
      {
        colorId: "separatorLine",
        label: "Separator Border",
      },
      {
        colorId: "tertiaryBg",
        label: "Muted Background",
      },
      {
        colorId: "skeletonBg",
        label: "Skeleton Background",
      },
    ],
  },
  {
    section: "Texts",
    colors: [
      {
        colorId: "primaryText",
        label: "Primary Text",
      },
      {
        colorId: "secondaryText",
        label: "Secondary Text",
      },

      {
        colorId: "selectedTextColor",
        label: "Selected Text Color",
      },
      {
        colorId: "selectedTextBg",
        label: "Selected Text Background",
      },
    ],
  },
  {
    section: "Buttons",
    colors: [
      {
        colorId: "primaryButtonBg",
        label: "Primary Button Background",
      },
      {
        colorId: "primaryButtonText",
        label: "Primary Button Text",
      },
      {
        colorId: "secondaryButtonBg",
        label: "Secondary Button Background",
      },
      {
        colorId: "secondaryButtonText",
        label: "Secondary Button Text",
      },
      {
        colorId: "secondaryButtonHoverBg",
        label: "Secondary Button Hover Background",
      },
      {
        colorId: "accentButtonBg",
        label: "Accent Button Background",
      },
      {
        colorId: "accentButtonText",
        label: "Accent Button Text",
      },
      {
        colorId: "connectedButtonBg",
        label: "Connected Button Background",
      },
      {
        colorId: "connectedButtonBgHover",
        label: "Connected Button Hover Background",
      },
    ],
  },
  {
    section: "Icons",
    colors: [
      {
        colorId: "secondaryIconColor",
        label: "Secondary Icon Color",
      },
      {
        colorId: "secondaryIconHoverColor",
        label: "Secondary Icon Hover Color",
      },
      {
        colorId: "secondaryIconHoverBg",
        label: "Secondary Icon Hover Background",
      },
    ],
  },
  {
    section: "Others",
    colors: [
      {
        colorId: "danger",
        label: "Danger",
      },
      {
        colorId: "success",
        label: "Success",
      },
      {
        colorId: "tooltipBg",
        label: "Tooltip Background",
      },
      {
        colorId: "tooltipText",
        label: "Tooltip Text",
      },
      {
        colorId: "inputAutofillBg",
        label: "Input Autofill Background",
      },
      {
        colorId: "scrollbarBg",
        label: "Scrollbar Background",
      },
    ],
  },
];
