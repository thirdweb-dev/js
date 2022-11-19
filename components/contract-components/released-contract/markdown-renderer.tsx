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
    mb: 2,
    pb: 2,
  };

  return (
    <ChakraReactMarkdown
      {...restProps}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => (
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
        h2: (props) => (
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
        h3: (props) => (
          <Heading
            as="h4"
            size="title.sm"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        h4: (props) => (
          <Heading
            as="h5"
            size="subtitle.md"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        h5: (props) => (
          <Heading
            as="h6"
            size="subtitle.sm"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        h6: (props) => (
          <Heading
            as="p"
            size="label.md"
            {...commonHeadingProps}
            {...props}
            mt={4}
          />
        ),
        a: (props) => (
          <Link
            _dark={{
              color: "blue.300",
              _hover: {
                color: "blue.500",
              },
            }}
            _light={{
              color: "blue.500",
              _hover: {
                color: "blue.700",
              },
            }}
            isExternal
            {...props}
            mt={4}
          />
        ),
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
        p: (props) => (
          <Text size="body.md" mb={4} {...props} lineHeight={1.5} />
        ),
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ul: ({ ordered, ...props }) => <UnorderedList {...props} mb={4} />,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ol: ({ ordered, ...props }) => <OrderedList {...props} mb={4} />,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        li: ({ children: c, ordered, ...props }) => (
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
