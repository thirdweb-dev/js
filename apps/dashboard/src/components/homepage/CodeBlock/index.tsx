import {
  Box,
  Code,
  type CodeProps,
  Flex,
  Icon,
  IconButton,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { useClipboard } from "hooks/useClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useRef, useState } from "react";
import { BsLightning } from "react-icons/bs";
import { useInView } from "react-intersection-observer";
import { Text } from "tw-components";

const darkThemeDefault = themes.vsDark;
const lightThemeDefault = themes.vsLight;

type PrismTheme = typeof darkThemeDefault;

interface CodeBlockProps extends Omit<CodeProps, "size"> {
  code: string;
  language: string;
  canCopy?: boolean;
  wrap?: boolean;
  prefix?: string;
  darkTheme?: PrismTheme;
  lightTheme?: PrismTheme;
  autoType?: boolean;
  typingSpeed?: number;
  title?: string;
  titleColor?: string;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  containerHeight?: any;
}
export const HomePageCodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  px = 4,
  py = 2,
  w = "full",
  borderRadius = "md",
  borderColor = "borderColor",
  borderWidth = "1px",
  fontFamily = "mono",
  backgroundColor,
  prefix,
  canCopy = true,
  wrap = true,
  darkTheme = themes.vsDark,
  lightTheme,
  autoType = false,
  typingSpeed = 50,
  title,
  titleColor,
  ...restCodeProps
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const theme = useColorModeValue(
    lightTheme || lightThemeDefault,
    darkTheme || darkThemeDefault,
  );
  const { onCopy, hasCopied } = useClipboard(code);
  const [speedUpEnabled, setSpeedUpEnabled] = useState(false);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [currentTypingSpeed] = useState(typingSpeed);
  const containerRef = useRef<HTMLDivElement>(null);

  const chakraTheme = useTheme();

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!inView) {
      return;
    }
    const interval = setInterval(() => {
      if (currentCodeIndex < code.length) {
        setCurrentCodeIndex((prev) => prev + 1);
      } else {
        // clear the interval when the code is fully typed
        clearInterval(interval);
      }
    }, currentTypingSpeed);

    return () => clearInterval(interval);
  }, [currentCodeIndex, currentTypingSpeed, code, inView]);

  // legitimate use-case
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  return (
    <Box ref={ref}>
      <Flex
        direction="column"
        w="full"
        h="full"
        border="1px solid"
        borderColor="borderColor"
        borderRadius="lg"
      >
        <Flex
          justify="space-between"
          align="center"
          px={2}
          py={2}
          bg="#161b22"
          roundedTop="lg"
          w="full"
        >
          {canCopy && code && autoType && currentCodeIndex < code.length ? (
            <IconButton
              onClick={() => {
                setSpeedUpEnabled((prev) => {
                  setCurrentCodeIndex(code.length);
                  return !prev;
                });
              }}
              aria-label="Copy"
              borderRadius="md"
              variant="ghost"
              colorScheme="gray"
              size="sm"
              icon={<Icon as={BsLightning} />}
            />
          ) : (
            <Box w="32px" />
          )}
          {title && (
            <Text
              fontSize="large"
              fontWeight="bold"
              position="static"
              color={titleColor ? titleColor : "white"}
              px={4}
              py={2}
              h="120%"
              mb={-2}
            >
              {title}
            </Text>
          )}
          {canCopy && code && (
            <IconButton
              onClick={onCopy}
              aria-label="Copy"
              borderRadius="md"
              variant="ghost"
              colorScheme="gray"
              size="sm"
              icon={
                hasCopied ? (
                  <CheckIcon className="size-4 text-green-500" />
                ) : (
                  <CopyIcon className="size-4" />
                )
              }
            />
          )}
        </Flex>
        <Highlight
          code={
            prefix
              ? `${prefix} ${code}`
              : autoType
                ? speedUpEnabled
                  ? code
                  : code.slice(0, currentCodeIndex)
                : code
          }
          language={language}
          theme={{
            ...theme,
            plain: {
              backgroundColor:
                (backgroundColor as string) ||
                "var(--chakra-colors-backgroundHighlight)",
            },
          }}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Box
              ref={containerRef}
              borderRadius={borderRadius}
              py={py}
              px={px}
              w={w}
              borderWidth={borderWidth}
              borderColor={borderColor}
              position="relative"
              className={className}
              style={style}
              fontFamily={fontFamily}
              whiteSpace={wrap ? "pre-wrap" : "pre"}
              overflowY="auto"
              {...restCodeProps}
              as={Code}
              h="full"
            >
              <div>
                <Box as="span" display="block" my={1} color="heading">
                  {tokens.map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    <Box key={i} {...getLineProps({ line })}>
                      <LineNumbers
                        lineNumber={i + 1}
                        lineHeight={chakraTheme.sizes["5"]}
                        totalLines={tokens.length}
                      />
                      {line.map((token, key) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </Box>
                  ))}
                </Box>
              </div>
            </Box>
          )}
        </Highlight>
      </Flex>
    </Box>
  );
};

interface LineNumbersProps {
  lineNumber: number;
  lineHeight: string | number;
  totalLines: number;
}

const LineNumbers: React.FC<LineNumbersProps> = ({
  lineNumber,
  lineHeight,
  totalLines,
}) => {
  const maxLineNumber = totalLines.toString().length;
  const filledLineNumber = lineNumber.toString().padStart(maxLineNumber, " ");
  return (
    <Box
      as="span"
      display="inline-block"
      textAlign="right"
      paddingRight="1em"
      userSelect="none"
      opacity={0.3}
      lineHeight={lineHeight}
    >
      {filledLineNumber}
    </Box>
  );
};
