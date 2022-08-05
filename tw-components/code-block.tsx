import { Text } from "./text";
import {
  Box,
  Code,
  CodeProps,
  Icon,
  IconButton,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import Highlight, { Language, defaultProps } from "prism-react-renderer";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Prism from "prism-react-renderer/prism";
import darkTheme from "prism-react-renderer/themes/oceanicNext";
import lightTheme from "prism-react-renderer/themes/vsLight";
import { FiCopy } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";

// add solidity lang support for code
((typeof global !== "undefined" ? global : window) as any).Prism = Prism;
require("prismjs/components/prism-solidity");
// end add solidity support

interface CodeBlockProps extends Omit<CodeProps, "size"> {
  code: string;
  language: Language | "solidity";
  canCopy?: boolean;
  wrap?: boolean;
}
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  px = 4,
  py = 2,
  w = "full",
  borderRadius = "md",
  borderColor = "borderColor",
  borderWidth = "1px",
  canCopy = true,
  wrap = true,
  ...restCodeProps
}) => {
  const theme = useColorModeValue(lightTheme, darkTheme);
  const { onCopy, hasCopied } = useClipboard(code);
  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language as Language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Text
          borderRadius={borderRadius}
          py={py}
          px={px}
          w={w}
          borderWidth={borderWidth}
          borderColor={borderColor}
          position="relative"
          className={className}
          style={style}
          whiteSpace={wrap ? "pre-wrap" : "pre"}
          {...restCodeProps}
          as={Code}
        >
          {canCopy && code && (
            <IconButton
              mr={-2}
              onClick={onCopy}
              position="relative"
              float="right"
              aria-label="Copy"
              borderRadius="md"
              variant="ghost"
              colorScheme="gray"
              size="sm"
              icon={
                <Icon
                  as={hasCopied ? IoMdCheckmark : FiCopy}
                  fill={hasCopied ? "green.500" : undefined}
                />
              }
            />
          )}

          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <Box {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </Box>
          ))}
        </Text>
      )}
    </Highlight>
  );
};
