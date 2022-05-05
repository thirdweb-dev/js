import { Text } from "./text";
import {
  Code,
  CodeProps,
  Icon,
  IconButton,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import Highlight, { Language, defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/oceanicNext";
import lightTheme from "prism-react-renderer/themes/vsLight";
import { FiCopy } from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";

interface CodeBlockProps extends Omit<CodeProps, "size"> {
  code: string;
  language: Language;
  canCopy?: boolean;
}

export const CodeBlock: React.VFC<CodeBlockProps> = ({
  code,
  language,
  px = 4,
  py = 2,
  w = "full",
  borderRadius = "md",
  canCopy = true,
  ...restCodeProps
}) => {
  const theme = useColorModeValue(lightTheme, darkTheme);
  const { onCopy, hasCopied } = useClipboard(code);
  return (
    <Highlight {...defaultProps} code={code} language={language} theme={theme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Text
          borderRadius={borderRadius}
          py={py}
          px={px}
          w={w}
          whiteSpace="pre-wrap"
          {...restCodeProps}
          className={className}
          style={style}
          borderWidth="1px"
          borderColor="borderColor"
          position="relative"
          as={Code}
        >
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}

          {canCopy && code && (
            <IconButton
              onClick={onCopy}
              position="absolute"
              right={1}
              top={1}
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
        </Text>
      )}
    </Highlight>
  );
};
