import {
  Box,
  Container,
  Flex,
  FormControl,
  Icon,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { MdMarkEmailRead } from "react-icons/md";
import { Button, Text } from "tw-components";

export const NewsletterSection = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  return (
    <Box bgColor="rgba(0,0,0,.6)" zIndex="100">
      <Container as="section" maxW="container.page" color="gray.500">
        <Stack
          spacing="8"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          py={{ base: "12", md: "16" }}
          px={12}
        >
          <Stack direction="row" spacing={5} align="center">
            <Icon boxSize={8} color="white" as={MdMarkEmailRead} />
            <Stack>
              <Text color="white" size="label.lg">
                Sign up for our newsletter
              </Text>
              <Text>
                Join 40,000+ builders and stay up to date with our latest
                updates and news.
              </Text>
            </Stack>
          </Stack>

          <form
            onSubmit={form.handleSubmit(async (data) => {
              try {
                await fetch("/api/email-signup", {
                  method: "POST",
                  body: JSON.stringify({ email: data.email }),
                });
                form.setValue("email", "");
              } catch (err) {
                console.error(err);
              }
            })}
          >
            <Flex gap={0} minW={{ base: "100%", md: "350px" }}>
              <FormControl isRequired>
                <Input
                  borderRightRadius={0}
                  type="email"
                  borderColor="purple.500"
                  borderRight={0}
                  _hover={{ borderColor: "purple.500" }}
                  _focus={{ borderColor: "purple.500" }}
                  placeholder="Enter your email"
                  {...form.register("email")}
                  autoComplete="email"
                />
              </FormControl>
              <Button
                borderLeftRadius={0}
                flexShrink={0}
                isLoading={form.formState.isSubmitting}
                type="submit"
                mr={2}
                colorScheme="purple"
              >
                Sign up
              </Button>
            </Flex>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};
