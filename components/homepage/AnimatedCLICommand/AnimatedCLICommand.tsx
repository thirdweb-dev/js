import styles from "./AnimatedCLICommand.module.css";
import { Box, Flex, Icon, IconButton, useClipboard } from "@chakra-ui/react";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { useTrack } from "hooks/analytics/useTrack";
import { useEffect, useRef } from "react";
import { FiCopy } from "react-icons/fi";
import { Text } from "tw-components";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * types given texts one after another - one character at a time - indefinitely
 */
function useCycledTyping(texts: string[]) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let isMounted = true;
    const span = spanRef.current;

    // type the given text
    async function type(text: string) {
      if (!span) {
        return;
      }

      // type the text one character at a time
      let i = 0;
      while (i < text.length) {
        span.textContent = text.slice(0, i + 1);
        await sleep(100);
        i++;
      }

      // keep the typed text on screen for a while
      await sleep(2000);

      // erase the typed text one character at a time - but faster
      while (i >= 0) {
        span.textContent = text.slice(0, i);
        i--;
        await sleep(40);
      }
    }

    async function startTyping() {
      if (!span) {
        return;
      }

      // cycle through the texts
      let i = 0;
      while (isMounted) {
        await type(texts[i % texts.length]);
        i++;
      }
    }

    startTyping();

    return () => {
      isMounted = false;
      if (span) {
        span.textContent = "";
      }
    };
  });

  return spanRef;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const { onCopy, hasCopied } = useClipboard(text);
  const trackEvent = useTrack();
  return (
    <IconButton
      ml="auto"
      borderRadius="md"
      variant="ghost"
      colorScheme="whiteAlpha"
      size="sm"
      aria-label="Copy npx command"
      onClick={() => {
        onCopy();
        trackEvent({
          category: "hero-section",
          action: "copy",
          label: "npx command",
        });
      }}
      icon={
        <Icon
          as={hasCopied ? IoMdCheckmark : FiCopy}
          fill={hasCopied ? "green.500" : undefined}
        />
      }
    />
  );
};

export const AnimatedCLICommand: React.FC = () => {
  const spanRef = useCycledTyping(["create", "deploy", "release"]);

  return (
    <Flex
      background="rgba(255, 255, 255, 0.08)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="md"
      flexShrink={0}
      py={3}
      px={4}
      minW={{ base: "100%", md: "240px" }}
      gap={1}
      align="center"
      alignSelf="start"
    >
      <Text
        color="white"
        fontFamily="mono"
        fontSize="16px"
        fontWeight="500"
        whiteSpace="nowrap"
      >
        <span>$ npx thirdweb </span>
        <span ref={spanRef}></span>
      </Text>
      <Box className={styles.cursor}></Box>
      <CopyButton text="npx thirdweb" />
    </Flex>
  );
};
