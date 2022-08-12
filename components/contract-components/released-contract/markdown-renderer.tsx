import {
  BoxProps,
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
import { Language } from "prism-react-renderer";
import { onlyText } from "react-children-utilities";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CodeBlock, Heading, Text } from "tw-components";

const ChakraReactMarkdown = chakra(ReactMarkdown);

export const MarkdownRenderer: React.FC<
  BoxProps & { markdownText: string }
> = ({ markdownText, ...restProps }) => {
  const commonHeadingProps = {
    lineHeight: "1.25",
    mb: 4,
    pb: 2,
  };

  return (
    <ChakraReactMarkdown
      {...restProps}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => (
          <Heading
            size="title.lg"
            borderBottom="1px solid"
            borderBottomColor="borderColor"
            {...commonHeadingProps}
            {...props}
          />
        ),
        h2: (props) => (
          <Heading
            size="title.md"
            borderBottom="1px solid"
            borderBottomColor="borderColor"
            mt={6}
            {...commonHeadingProps}
            {...props}
          />
        ),
        h3: (props) => (
          <Heading size="title.sm" {...commonHeadingProps} {...props} />
        ),
        h4: (props) => (
          <Heading size="subtitle.md" {...commonHeadingProps} {...props} />
        ),
        h5: (props) => (
          <Heading size="subtitle.sm" {...commonHeadingProps} {...props} />
        ),
        h6: (props) => (
          <Heading size="label.md" {...commonHeadingProps} {...props} />
        ),
        a: (props) => <Link color="primary.500" isExternal {...props} />,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        code: ({ inline, ...props }) => {
          if (props?.className) {
            const language = props.className.replace("language-", "");
            return (
              <CodeBlock
                code={onlyText(props.children).trim()}
                language={language as Language}
                mb={4}
                {...props}
              />
            );
          }

          return (
            <Text
              as="code"
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
        p: (props) => <Text size="body.md" mb={4} {...props} />,
        table: (props) => (
          <Card
            maxW="100%"
            overflowX="auto"
            position="relative"
            px={0}
            py={0}
            mb={4}
          >
            <Table {...props} />
          </Card>
        ),
        th: ({ children: c, ...props }) => (
          <Th
            {...(props as unknown as any)}
            textAlign="left!important"
            borderColor="borderColor"
          >
            {" "}
            <Text as="label" size="label.md">
              {c}
            </Text>{" "}
          </Th>
        ),
        td: (props) => (
          <Td
            {...(props as unknown as any)}
            borderColor="borderColor"
            textAlign="left!important"
            borderBottomWidth={"inherit"}
          />
        ),
        thead: (props) => (
          <Thead
            {...props}
            bg="blackAlpha.50"
            _dark={{ bg: "whiteAlpha.50" }}
          />
        ),
        tbody: (props) => <Tbody {...props} />,
        tr: (props) => (
          <Tr
            {...props}
            transition="all 0.1s"
            borderBottomWidth={1}
            _last={{ borderBottomWidth: 0 }}
          />
        ),
        ul: (props) => <UnorderedList {...props} mb={4} />,
        ol: (props) => <OrderedList {...props} mb={4} />,
        li: ({ children: c, ...props }) => (
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
