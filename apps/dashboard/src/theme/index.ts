"use client";

import { extendTheme, type Theme } from "@chakra-ui/react";
import { getColor, mode } from "@chakra-ui/theme-tools";
import { skeletonTheme } from "./chakra-componens/skeleton";
import { colors } from "./colors";
import { fontWeights, letterSpacings, lineHeights } from "./typography";

const chakraTheme: Theme = extendTheme({
  colors,
  components: {
    Badge: {
      baseStyle: {
        backgroundColor: "badgeBg",
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "md",
      },
      variants: {
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        gradient: (props: any) => {
          const { theme, fromcolor, tocolor } = props;
          const lgFrom = getColor(theme, fromcolor);
          const lgTo = getColor(theme, tocolor);
          const bgColor = getColor(theme, mode("white", "gray.800")(props));

          return {
            _hover: {
              "> *": {
                backgroundPosition: "right",
              },
              backgroundPosition: "right",
              opacity: 0.9,
            },
            "> *": {
              background: `linear-gradient(135deg, ${lgFrom}, ${lgTo}, ${lgFrom})`,
              backgroundClip: "text",
              backgroundSize: "200%",
              textFillColor: "transparent",
              transitionDuration: "slow",
              transitionProperty: "background",
              transitionTimingFunction: "easeOut",
            },
            background: `linear-gradient(${bgColor}, ${bgColor}) padding-box,
            linear-gradient(135deg, ${lgFrom}, ${lgTo}, ${lgFrom}) border-box`,
            backgroundSize: "200%",
            border: "3px solid",
            borderColor: "transparent",
            borderRadius: "md",
            transitionDuration: "slow",
            transitionProperty: "opacity, background",
          };
        },
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        highlighted: (props: any) => ({
          _hover: {
            boxShadow: "0 0 10px 2px rgba(51, 133, 255, 1)",
            transform: "scale(1.05)",
          },
          bg: "#151515",
          borderRadius: props.fullCircle ? "full" : "12px",
          size: "lg",
        }),
        inverted: {
          _disabled: {
            _hover: {
              bg: "bgBlack !important",
            },
          },
          _hover: {
            opacity: 0.8,
          },
          bg: "bgBlack",
          color: "bgWhite",
        },
        outline: {
          _hover: {
            bg: "transparent",
            borderColor: "inputBorderHover",
          },
          borderColor: "inputBorder",
          borderWidth: "1px",
        },
      },
    },
    Divider: {
      baseStyle: {
        borderColor: "borderColor",
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          background: "backgroundHighlight",
        },
        overlay: {
          backdropFilter: "blur(5px)",
        },
      },
    },
    Heading: {
      baseStyle: {
        color: "heading",
      },
    },
    Input: {
      defaultProps: {
        variant: "filled",
      },
      sizes: {
        xl: {
          addon: {
            borderRadius: "md",
            fontSize: "lg",
            h: 14,
            px: 4,
          },
          field: {
            borderRadius: "md",
            fontSize: "lg",
            h: 14,
            px: 4,
          },
        },
      },
      variants: {
        filled: {
          field: {
            _focus: {
              borderColor: "blue.500",
            },
            _hover: {
              background: "transparent",
              borderColor: "inputBorderHover",
            },
            background: "transparent",
            borderColor: "inputBorder",
            borderWidth: "1px",
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        item: {
          _hover: {
            bg: "hsl(var(--muted))",
          },
          bg: "backgroundHighlight",
          py: 3,
        },
        list: {
          bg: "backgroundHighlight",
          borderColor: "borderColor",
          borderRadius: "lg",
          borderWidth: 1,
          overflow: "hidden",
          py: 0,
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          background: "backgroundHighlight",
        },
        overlay: {
          backdropFilter: "blur(5px)",
        },
      },
    },
    NumberInput: {
      defaultProps: {
        variant: "filled",
      },
      sizes: {
        xl: {
          addon: {
            borderRadius: "md",
            fontSize: "lg",
            h: 14,
            px: 4,
          },
          field: {
            borderRadius: "md",
            fontSize: "lg",
            h: 14,
            px: 4,
          },
        },
      },
      variants: {
        filled: {
          field: {
            _hover: {
              background: "inputBgHover",
              borderColor: "blue.500",
            },
            _invalid: {
              borderColor: "inputBorder",
            },
            background: "inputBg",
            borderColor: "inputBorder",
            borderWidth: "1px",
          },
        },
      },
    },
    Select: {
      defaultProps: {
        variant: "filled",
      },
      variants: {
        filled: {
          field: {
            _hover: {
              background: "inputBgHover",
              borderColor: "blue.500",
            },
            background: "inputBg",
            borderColor: "borderColor",
            borderWidth: "1px",
          },
        },
      },
    },
    Skeleton: skeletonTheme,
    Table: {
      baseStyle: {
        cell: {
          borderColor: "borderColor",
        },
        tbody: {
          background: "backgroundHighlight",
        },
        thead: {
          background: "backgroundHighlight",
          borderBottomColor: "hsl(var(--border))",
          borderBottomWidth: 1,
        },
      },
      sizes: {
        md: {
          td: {
            borderBottom: "none",
            fontSize: "14px",
            px: 6,
            py: 2,
          },
          th: {
            borderBottom: "none",
            color: "faded",
            fontSize: "12px",
            fontWeight: "600",
            py: 4,
          },
        },
      },
    },
    Text: {
      baseStyle: {
        color: "paragraph",
      },
    },
    Textarea: {
      defaultProps: {
        variant: "filled",
      },
      variants: {
        filled: {
          _focus: {
            borderColor: "blue.500",
          },
          _hover: {
            background: "transparent",
            borderColor: "inputBorderHover",
          },
          background: "transparent",
          borderColor: "inputBorder",
          borderWidth: "1px",
        },
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  } as Theme["config"],
  fontSizes: [],
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
    mono: "IBM Plex Mono, monospace",
  },
  fontWeights,
  letterSpacings,
  lineHeights,
  semanticTokens: {
    colors: {
      backgroundBody: {
        _dark: "hsl(var(--background))",
        default: "hsl(var(--background))",
      },
      backgroundCardHighlight: {
        _dark: "#0b0b0b",
        // equivalent to muted/50 but without transparency
        default: "#f8f8f8",
      },
      backgroundHighlight: {
        _dark: "#0b0b0b",
        // equivalent to muted/50 but without transparency
        default: "#f8f8f8",
      },

      // other
      badgeBg: {
        _dark: "hsl(var(--background))",
        default: "hsl(var(--background))",
      },
      bgBlack: { _dark: "white", default: "black" },
      bgWhite: { _dark: "black", default: "#fff" },

      borderColor: {
        _dark: "hsl(var(--border))",
        default: "hsl(var(--border))",
      },
      faded: {
        _dark: "hsl(var(--muted-foreground))",
        default: "hsl(var(--muted-foreground))",
      },
      heading: {
        _dark: "hsl(var(--foreground))",
        default: "hsl(var(--foreground))",
      },
      // inputs
      inputBg: { _dark: "hsl(var(--card))", default: "hsl(var(--card))" },
      inputBgHover: { _dark: "hsl(var(--card))", default: "hsl(var(--card))" },
      inputBorder: { _dark: "hsl(var(--input))", default: "hsl(var(--input))" },
      inputBorderHover: {
        _dark: "hsl(var(--input))",
        default: "hsl(var(--input))",
      },
      paragraph: {
        _dark: "hsl(var(--muted-foreground))",
        default: "hsl(var(--muted-foreground))",
      },
      secondaryCardHighlight: {
        _dark: "hsl(var(--background))",
        default: "hsl(var(--background))",
      },
      wordmark: {
        _dark: "hsl(var(--muted-foreground))",
        default: "hsl(var(--muted-foreground))",
      },
    },
  },
  sizes: {
    container: {
      hero: "1440px",
      page: "1170px",
    },
  },
  styles: {
    global: {
      "::-moz-selection": {
        backgroundColor: "#90cdf4",
        color: "#fefefe",
      },
      "::selection": {
        backgroundColor: "#90cdf4",
        color: "#fefefe",
      },
      body: {
        colorScheme: "dark",
      },
      "html, body": {
        background: "#000",
        fontFeatureSettings: `'zero' 1`,
        margin: 0,
        padding: 0,
        scrollBehavior: "smooth",
      },
    },
  },
}) as Theme;

export default chakraTheme;
