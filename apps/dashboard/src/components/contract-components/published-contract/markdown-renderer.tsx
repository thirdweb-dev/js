/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  type BoxProps,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UnorderedList,
  chakra,
} from "@chakra-ui/react";
import { onlyText } from "react-children-utilities";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock, Heading, Text } from "tw-components";

const ChakraReactMarkdown = chakra(ReactMarkdown);

export const MarkdownRenderer: React.FC<
  BoxProps & { markdownText: string }
> = ({ markdownText, ...restProps }) => {
  const commonHeadingProps = {
    lineHeight: "1.25",
    mb: 2,
    pb: 2,
  };

  return (
    <ChakraReactMarkdown
      {...restProps}
      remarkPlugins={[remarkGfm]}
      components={{
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        h1: (props: any) => (
          <Heading
            as="h2"
            size="title.lg"
            borderBottom="1px solid"
            borderBottomColor="borderColor"
            {...commonHeadingProps}
            mb={4}
            {...props}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        h2: (props: any) => (
          <Heading
            as="h3"
            size="title.md"
            borderBottom="1px solid"
            borderBottomColor="borderColor"
            {...commonHeadingProps}
            mt={8}
            mb={4}
            {...props}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        h3: (props: any) => (
          <Heading
            as="h4"
            size="title.sm"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        h4: (props: any) => (
          <Heading
            as="h5"
            size="subtitle.md"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        h5: (props: any) => (
          <Heading
            as="h6"
            size="subtitle.sm"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        h6: (props: any) => (
          <Heading
            as="p"
            size="label.md"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        a: (props: any) => (
          <Link
            _dark={{
              color: "blue.400",
              _hover: {
                color: "blue.500",
              },
            }}
            _light={{
              color: "blue.500",
              _hover: {
                color: "blue.500",
              },
            }}
            isExternal
            {...props}
            mt={4}
          />
        ),

        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        code: ({ inline, ...props }: any) => {
          if (props?.className) {
            const language = props.className.replace("language-", "");
            return (
              <CodeBlock
                code={onlyText(props.children).trim()}
                language={language}
                mb={4}
                {...props}
              />
            );
          }

          return (
            <Text
              as="code"
              whiteSpace="break-spaces"
              px={1}
              py={0.5}
              bg="blackAlpha.100"
              _dark={{ bg: "whiteAlpha.100" }}
              borderRadius="md"
              fontFamily="mono"
              {...props}
            />
          );
        },
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        p: (props: any) => (
          <Text size="body.md" mb={4} {...props} lineHeight={1.5} />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        table: (props: any) => (
          <Box
            maxW="100%"
            overflowX="auto"
            position="relative"
            px={0}
            py={0}
            mb={4}
            borderTopRadius="lg"
          >
            <Table {...props} />
          </Box>
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        th: ({ children: c, ...props }: any) => (
          <Th
            // biome-ignore lint/suspicious/noExplicitAny: FIXME
            {...(props as unknown as any)}
            textAlign="left!important"
            border="none"
          >
            <Text as="label" size="label.sm" color="faded">
              {c}
            </Text>
          </Th>
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        td: (props: any) => (
          <Td
            // biome-ignore lint/suspicious/noExplicitAny: FIXME
            {...(props as unknown as any)}
            borderColor="borderColor"
            textAlign="left!important"
            borderBottomWidth={"inherit"}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        thead: (props: any) => <Thead {...props} />,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        tbody: (props: any) => <Tbody {...props} />,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        tr: (props: any) => (
          <Tr
            {...props}
            transition="all 0.1s"
            borderBottomWidth={1}
            _last={{ borderBottomWidth: 0 }}
          />
        ),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        ul: ({ ordered, ...props }: any) => <UnorderedList {...props} mb={4} />,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        ol: ({ ordered, ...props }: any) => <OrderedList {...props} mb={4} />,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        li: ({ children: c, ordered, ...props }: any) => (
          <ListItem {...props}>
            <Text>{c}</Text>
          </ListItem>
        ),
      }}
    >
      {markdownText}
    </ChakraReactMarkdown>
  );
};
