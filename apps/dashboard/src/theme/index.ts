"use client";

import { type Theme, extendTheme } from "@chakra-ui/react";
import { getColor, mode } from "@chakra-ui/theme-tools";
import { skeletonTheme } from "./chakra-componens/skeleton";
import { colors } from "./colors";
import { fontWeights, letterSpacings, lineHeights } from "./typography";

const chakraTheme: Theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  } as Theme["config"],
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
    mono: "IBM Plex Mono, monospace",
  },
  styles: {
    global: {
      "html, body": {
        background: "#000",
        padding: 0,
        margin: 0,
        fontFeatureSettings: `'zero' 1`,
        scrollBehavior: "smooth",
      },
      body: {
        colorScheme: "dark",
      },
      "::selection": {
        backgroundColor: "#90cdf4",
        color: "#fefefe",
      },
      "::-moz-selection": {
        backgroundColor: "#90cdf4",
        color: "#fefefe",
      },
    },
  },
  components: {
    Skeleton: skeletonTheme,
    Heading: {
      baseStyle: {
        color: "heading",
      },
    },
    Text: {
      baseStyle: {
        color: "paragraph",
      },
    },
    Divider: {
      baseStyle: {
        borderColor: "borderColor",
      },
    },
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
            border: "3px solid",
            borderColor: "transparent",
            borderRadius: "md",
            background: `linear-gradient(${bgColor}, ${bgColor}) padding-box,
            linear-gradient(135deg, ${lgFrom}, ${lgTo}, ${lgFrom}) border-box`,
            transitionProperty: "opacity, background",
            transitionDuration: "slow",
            backgroundSize: "200%",
            "> *": {
              transitionProperty: "background",
              transitionDuration: "slow",
              transitionTimingFunction: "easeOut",
              background: `linear-gradient(135deg, ${lgFrom}, ${lgTo}, ${lgFrom})`,
              backgroundSize: "200%",
              backgroundClip: "text",
              textFillColor: "transparent",
            },
            _hover: {
              backgroundPosition: "right",
              "> *": {
                backgroundPosition: "right",
              },
              opacity: 0.9,
            },
          };
        },
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        highlighted: (props: any) => ({
          bg: "#151515",
          _hover: {
            boxShadow: "0 0 10px 2px rgba(51, 133, 255, 1)",
            transform: "scale(1.05)",
          },
          size: "lg",
          borderRadius: props.fullCircle ? "full" : "12px",
        }),
        inverted: {
          bg: "bgBlack",
          color: "bgWhite",
          _hover: {
            opacity: 0.8,
          },
          _disabled: {
            _hover: {
              bg: "bgBlack !important",
            },
          },
        },
        outline: {
          borderWidth: "1px",
          borderColor: "inputBorder",
          _hover: {
            bg: "transparent",
            borderColor: "inputBorderHover",
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        overlay: {
          backdropFilter: "blur(5px)",
        },
        dialog: {
          background: "backgroundHighlight",
        },
      },
    },
    Drawer: {
      baseStyle: {
        overlay: {
          backdropFilter: "blur(5px)",
        },
        dialog: {
          background: "backgroundHighlight",
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
            borderWidth: "1px",
            borderColor: "borderColor",
            background: "inputBg",
            _hover: {
              background: "inputBgHover",
              borderColor: "blue.500",
            },
          },
        },
      },
    },
    Input: {
      defaultProps: {
        variant: "filled",
      },
      variants: {
        filled: {
          field: {
            borderWidth: "1px",
            borderColor: "inputBorder",
            background: "transparent",
            _hover: {
              borderColor: "inputBorderHover",
              background: "transparent",
            },
            _focus: {
              borderColor: "blue.500",
            },
          },
        },
      },
      sizes: {
        xl: {
          field: {
            fontSize: "lg",
            px: 4,
            h: 14,
            borderRadius: "md",
          },
          addon: {
            fontSize: "lg",
            px: 4,
            h: 14,
            borderRadius: "md",
          },
        },
      },
    },
    NumberInput: {
      defaultProps: {
        variant: "filled",
      },
      variants: {
        filled: {
          field: {
            borderWidth: "1px",
            borderColor: "inputBorder",
            background: "inputBg",
            _hover: {
              background: "inputBgHover",
              borderColor: "blue.500",
            },
            _invalid: {
              borderColor: "inputBorder",
            },
          },
        },
      },
      sizes: {
        xl: {
          field: {
            fontSize: "lg",
            px: 4,
            h: 14,
            borderRadius: "md",
          },
          addon: {
            fontSize: "lg",
            px: 4,
            h: 14,
            borderRadius: "md",
          },
        },
      },
    },
    Textarea: {
      defaultProps: {
        variant: "filled",
      },
      variants: {
        filled: {
          borderWidth: "1px",
          borderColor: "inputBorder",
          background: "transparent",
          _hover: {
            borderColor: "inputBorderHover",
            background: "transparent",
          },
          _focus: {
            borderColor: "blue.500",
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "backgroundHighlight",
          py: 0,
          borderWidth: 1,
          borderColor: "borderColor",
          borderRadius: "lg",
          overflow: "hidden",
        },
        item: {
          bg: "backgroundHighlight",
          _hover: {
            bg: "hsl(var(--muted))",
          },
          py: 3,
        },
      },
    },
    Table: {
      baseStyle: {
        thead: {
          background: "backgroundHighlight",
          borderBottomColor: "hsl(var(--border))",
          borderBottomWidth: 1,
        },
        tbody: {
          background: "backgroundHighlight",
        },
        cell: {
          borderColor: "borderColor",
        },
      },
      sizes: {
        md: {
          td: {
            py: 2,
            px: 6,
            borderBottom: "none",
            fontSize: "14px",
          },
          th: {
            py: 4,
            fontSize: "12px",
            color: "faded",
            borderBottom: "none",
            fontWeight: "600",
          },
        },
      },
    },
  },
  colors,
  fontSizes: [],
  fontWeights,
  lineHeights,
  letterSpacings,
  sizes: {
    container: {
      page: "1170px",
      hero: "1440px",
    },
  },
  semanticTokens: {
    colors: {
      // inputs
      inputBg: { default: "hsl(var(--card))", _dark: "hsl(var(--card))" },
      inputBgHover: { default: "hsl(var(--card))", _dark: "hsl(var(--card))" },
      inputBorder: { default: "hsl(var(--input))", _dark: "hsl(var(--input))" },
      inputBorderHover: {
        default: "hsl(var(--input))",
        _dark: "hsl(var(--input))",
      },

      // other
      badgeBg: {
        default: "hsl(var(--background))",
        _dark: "hsl(var(--background))",
      },
      backgroundCardHighlight: {
        // equivalent to muted/50 but without transparency
        default: "#f8f8f8",
        _dark: "#0b0b0b",
      },
      bgBlack: { default: "black", _dark: "white" },
      bgWhite: { default: "#fff", _dark: "black" },
      backgroundBody: {
        default: "hsl(var(--background))",
        _dark: "hsl(var(--background))",
      },
      backgroundHighlight: {
        // equivalent to muted/50 but without transparency
        default: "#f8f8f8",
        _dark: "#0b0b0b",
      },
      secondaryCardHighlight: {
        default: "hsl(var(--background))",
        _dark: "hsl(var(--background))",
      },
      wordmark: {
        default: "hsl(var(--muted-foreground))",
        _dark: "hsl(var(--muted-foreground))",
      },
      heading: {
        default: "hsl(var(--foreground))",
        _dark: "hsl(var(--foreground))",
      },
      paragraph: {
        default: "hsl(var(--muted-foreground))",
        _dark: "hsl(var(--muted-foreground))",
      },
      faded: {
        default: "hsl(var(--muted-foreground))",
        _dark: "hsl(var(--muted-foreground))",
      },

      borderColor: {
        default: "hsl(var(--border))",
        _dark: "hsl(var(--border))",
      },
    },
  },
}) as Theme;

export default chakraTheme;
