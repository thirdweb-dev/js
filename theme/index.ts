import { skeletonTheme } from "./chakra-componens/skeleton";
import { colors } from "./colors";
import { fontWeights, letterSpacings, lineHeights } from "./typography";
import { Theme, extendTheme } from "@chakra-ui/react";
import { getColor, mode } from "@chakra-ui/theme-tools";

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
            bg: "accent.200",
          },
          py: 3,
        },
      },
    },
    Table: {
      baseStyle: {
        thead: {
          background: "backgroundHighlight",
          borderBottomColor: "accent.100",
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
      // accent color
      "accent.100": {
        default: "gray.100",
        _dark: "gray.900",
      },
      "accent.200": {
        default: "gray.200",
        _dark: "gray.800",
      },
      "accent.300": {
        default: "gray.300",
        _dark: "gray.700",
      },
      "accent.400": {
        default: "gray.400",
        _dark: "gray.600",
      },
      "accent.500": {
        default: "gray.500",
        _dark: "gray.500",
      },
      "accent.600": {
        default: "gray.600",
        _dark: "gray.400",
      },
      "accent.700": {
        default: "gray.700",
        _dark: "gray.300",
      },
      "accent.800": {
        default: "gray.800",
        _dark: "gray.200",
      },
      "accent.900": {
        default: "gray.900",
        _dark: "gray.100",
      },

      // inputs
      inputBg: { default: "gray.50", _dark: "whiteAlpha.50" },
      inputBgHover: { default: "gray.100", _dark: "whiteAlpha.100" },
      inputBorder: { default: "gray.200", _dark: "#272B30" },
      inputBorderHover: { default: "gray.300", _dark: "whiteAlpha.50" },

      // other
      badgeBg: { default: "blackAlpha.50", _dark: "whiteAlpha.50" },

      // backgroundBody: "accent.100",
      // backgroundHighlight: { default: "white", _dark: "accent.200" },
      // backgroundCardHighlight: { default: "white", _dark: "accent.100" },
      // backgroundNavbar: { default: "white", _dark: "accent.200" },
      // wordmark: { default: "#262A36", _dark: "whiteAlpha.900" },
      // heading: { default: "black", _dark: "white" },
      // paragraph: "accent.800",

      // borderColor: { default: "accent.200", _dark: "accent.300" },
      bgBlack: { default: "black", _dark: "white" },
      bgWhite: { default: "#fff", _dark: "black" },
      backgroundBody: { default: "backgroundLight", _dark: "backgroundDark" },
      backgroundHighlight: { default: "white", _dark: "#131417" },
      backgroundCardHighlight: { default: "white", _dark: "#232429" },
      wordmark: { default: "#262A36", _dark: "whiteAlpha.900" },
      heading: { default: "#262A36", _dark: "#ECECEC" },
      paragraph: { default: "rgba(39, 46, 54, 0.9)", _dark: "#b2b2b2" },
      faded: { default: "rgba(39, 46, 54, 0.6)", _dark: "#646D7A" },
      headingLight: { default: "#F2FBFF", _dark: "#262A36" },
      paragraphLight: {
        default: "rgba(242, 251, 255, 0.8)",
        _dark: "rgba(39, 46, 54, 0.9)",
      },
      borderColor: { default: "gray.200", _dark: "#272B30" },
      opaqueBg: {
        default: "whiteAlpha.500",
        _dark: "blackAlpha.600",
      },
    },
  },
}) as Theme;

export default chakraTheme;
