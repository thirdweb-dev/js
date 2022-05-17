import { colors } from "./colors";
import { fontWeights, letterSpacings, lineHeights } from "./typography";
import { DeepPartial, Theme, extendTheme } from "@chakra-ui/react";
import { getColor, mode } from "@chakra-ui/theme-tools";

const chakraTheme: Theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  } as Theme["config"],
  fonts: {
    heading: `"Inter", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
    body: `"Inter", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
    mono: `'IBM Plex Mono', monospace`,
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
    Button: {
      baseStyle: {
        borderRadius: "full",
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
            borderRadius: "full",
            background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, 
            linear-gradient(135deg, ${lgFrom}, ${lgTo}) border-box`,
            "> *": {
              background: `linear-gradient(135deg, ${lgFrom}, ${lgTo})`,
              backgroundClip: "text",
              textFillColor: "transparent",
            },
            _hover: {
              background: `linear-gradient(${bgColor}, ${bgColor}) padding-box, 
              linear-gradient(315deg, ${lgFrom}, ${lgTo}) border-box`,
              "> *": {
                background: `linear-gradient(315deg, ${lgFrom}, ${lgTo})`,
                backgroundClip: "text",
              },
            },
          };
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
            borderColor: "inputBorder",
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
            background: "inputBg",
            _hover: {
              background: "inputBgHover",
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
    Textarea: {
      defaultProps: {
        variant: "filled",
      },
      variants: {
        filled: {
          borderWidth: "1px",
          borderColor: "inputBorder",
          background: "inputBg",
          _hover: {
            background: "inputBgHover",
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
        },
        item: {
          py: 2,
        },
      },
    },
    Table: {
      baseStyle: {
        cell: {
          borderColor: "borderColor",
        },
      },
    },
  } as DeepPartial<Theme["components"]>,
  colors,
  fontSizes: [],
  fontWeights,
  lineHeights,
  letterSpacings,
  sizes: {
    container: {
      page: "1170px",
    },
  },
  semanticTokens: {
    colors: {
      // inputs
      inputBg: { default: "gray.50", _dark: "whiteAlpha.50" },
      inputBgHover: { default: "gray.100", _dark: "whiteAlpha.100" },
      inputBorder: { default: "gray.200", _dark: "transparent" },
      // other
      bgBlack: { default: "black", _dark: "white" },
      bgWhite: { default: "white", _dark: "black" },
      backgroundBody: { default: "backgroundLight", _dark: "backgroundDark" },
      backgroundHighlight: { default: "white", _dark: "#1B2129" },
      backgroundCardHighlight: { default: "white", _dark: "#0F1318" },
      wordmark: { default: "#262A36", _dark: "whiteAlpha.900" },
      heading: { default: "#262A36", _dark: "whiteAlpha.900" },
      paragraph: { default: "rgba(39, 46, 54, 0.9)", _dark: "gray.500" },
      headingLight: { default: "#F2FBFF", _dark: "#262A36" },
      paragraphLight: {
        default: "rgba(242, 251, 255, 0.8)",
        _dark: "rgba(39, 46, 54, 0.9)",
      },
      borderColor: { default: "gray.200", _dark: "whiteAlpha.100" },
    },
  },
}) as Theme;

export default chakraTheme;
