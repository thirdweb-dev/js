import { SearchIcon, SectionIcon } from "lucide-react";
import { useState } from "react";
import { darkTheme, lightTheme, type Theme } from "thirdweb/react";
import { Input } from "@/components/ui/input";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { ColorInput } from "./ColorInput";
import type { ConnectPlaygroundOptions } from "./types";

export function ColorFormGroup(props: {
  theme: ConnectPlaygroundOptions["theme"];
  onChange: (value: ConnectPlaygroundOptions["theme"]) => void;
}) {
  const [search, setSearch] = useState("");
  const { theme, onChange } = props;

  const themeObj =
    theme.type === "dark"
      ? darkTheme({
          colors: theme.darkColorOverrides,
        })
      : lightTheme({
          colors: theme.lightColorOverrides,
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
    <section className="flex flex-col rounded-lg border bg-card">
      {/* heading */}
      <div className="flex items-center justify-between gap-4 border-b p-4">
        <h2 className="font-semibold text-base"> Colors </h2>
        <div className="relative max-w-[320px] grow">
          <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="rounded-lg pl-9"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            value={search}
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
                <h3 className="flex items-center gap-1.5 px-2 py-3 font-semibold text-muted-foreground text-sm">
                  <SectionIcon className="size-4" />
                  {colorSection.section}
                </h3>
                <div className="flex flex-col gap-2 pb-4">
                  {colorSection.colors.map((color) => {
                    return (
                      // biome-ignore lint/a11y/noLabelWithoutControl: input is inside the label, so no need to add id
                      <label
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                        key={color.colorId}
                      >
                        <ColorInput
                          className="size-10"
                          onChange={(value) => {
                            const overridesKey =
                              theme.type === "dark"
                                ? "darkColorOverrides"
                                : "lightColorOverrides";

                            const newTheme = {
                              ...theme,
                              [overridesKey]: {
                                ...theme[overridesKey],
                                [color.colorId]: value,
                              },
                            };
                            onChange(newTheme);
                          }}
                          value={themeObj.colors[color.colorId]}
                        />
                        <div>
                          <div>{color.label}</div>
                          <div className="ml-auto font-mono text-muted-foreground text-xs">
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
            <p className="px-2 py-14 text-center text-muted-foreground">
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
    section: "General",
  },
  {
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
    section: "Texts",
  },
  {
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
    section: "Buttons",
  },
  {
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
    section: "Icons",
  },
  {
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
    section: "Others",
  },
];
