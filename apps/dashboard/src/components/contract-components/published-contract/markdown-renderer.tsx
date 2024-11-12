import { CodeClient } from "@/components/ui/code/code.client";
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
import { Heading, Text } from "tw-components";

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
            {...cleanedProps(props)}
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
            {...cleanedProps(props)}
          />
        ),

        h3: (props) => (
          <Heading
            as="h4"
            size="title.sm"
            {...commonHeadingProps}
            {...cleanedProps(props)}
            mt={4}
          />
        ),

        h4: (props) => (
          <Heading
            as="h5"
            size="subtitle.md"
            {...commonHeadingProps}
            {...cleanedProps(props)}
            mt={4}
          />
        ),

        h5: (props) => (
          <Heading
            as="h6"
            size="subtitle.sm"
            {...commonHeadingProps}
            {...cleanedProps(props)}
            mt={4}
          />
        ),

        h6: (props) => (
          <Heading
            as="p"
            size="label.md"
            {...commonHeadingProps}
            {...cleanedProps(props)}
            mt={4}
          />
        ),

        a: (props) => (
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
            {...cleanedProps(props)}
            mt={4}
          />
        ),

        code: ({ ...props }) => {
          if (props?.className) {
            const language = props.className.replace("language-", "");
            return (
              <div className="mb-4">
                <CodeClient
                  code={onlyText(props.children).trim()}
                  lang={language}
                  {...cleanedProps(props)}
                />
              </div>
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
              {...cleanedProps(props)}
            />
          );
        },

        p: (props) => (
          <Text
            size="body.md"
            mb={4}
            {...cleanedProps(props)}
            lineHeight={1.5}
          />
        ),

        table: (props) => (
          <Box
            maxW="100%"
            overflowX="auto"
            position="relative"
            px={0}
            py={0}
            mb={4}
            borderTopRadius="lg"
          >
            <Table {...cleanedProps(props)} />
          </Box>
        ),

        th: ({ children: c, ...props }) => (
          <Th {...cleanedProps(props)} textAlign="left" border="none">
            <Text as="span" size="label.sm" color="faded">
              {c}
            </Text>
          </Th>
        ),

        td: (props) => (
          <Td
            {...cleanedProps(props)}
            borderColor="borderColor"
            textAlign="left"
            borderBottomWidth="inherit"
          />
        ),
        thead: (props) => <Thead {...cleanedProps(props)} />,
        tbody: (props) => <Tbody {...cleanedProps(props)} />,
        tr: (props) => (
          <Tr
            {...cleanedProps(props)}
            transition="all 0.1s"
            borderBottomWidth={1}
            _last={{ borderBottomWidth: 0 }}
          />
        ),
        ul: (props) => {
          return <UnorderedList {...cleanedProps(props)} mb={4} />;
        },
        ol: (props) => <OrderedList {...cleanedProps(props)} mb={4} />,
        li: ({ children: c, ...props }) => (
          <ListItem {...cleanedProps(props)}>
            {/* hydration error - can not render p > p, so use span instead - remove extra span when we move to tailwind */}
            <Text as="span">{c}</Text>
          </ListItem>
        ),
      }}
    >
      {markdownText}
    </ChakraReactMarkdown>
  );
};

function cleanedProps<T extends object & { node?: unknown }>(
  props: T,
): Omit<T, "node"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { node, ...rest } = props;
  return rest;
}
