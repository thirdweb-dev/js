"use client";

import { emailSignup } from "@/actions/emailSignup";
import { Box, Container, Flex, FormControl, Input } from "@chakra-ui/react";
import { MailCheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Text } from "tw-components";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    // ignore invalid email
    if (!isValidEmail) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await emailSignup({
        email,
      });

      if (res.status.toString().startsWith("2")) {
        toast.success("Successfully signed up for our newsletter!");
      }

      setEmail("");
    } catch (err) {
      toast.error("Failed to sign up for our newsletter");
      console.error(err);
    }

    setIsSubmitting(false);
  }

  return (
    <Box bg="rgba(0,0,0,.6)" zIndex="100">
      <Container as="section" maxW="container.page" color="gray.500">
        <div className="flex flex-col justify-between gap-8 px-12 py-12 md:flex-row md:py-16">
          <div className="flex flex-row items-center gap-5">
            <MailCheckIcon className="size-8 text-white" />
            <div className="flex flex-col gap-2">
              <Text color="white" size="label.lg">
                Sign up for our newsletter
              </Text>
              <Text>
                Join 70,000+ builders and stay up to date with our latest
                updates and news.
              </Text>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
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
                  value={email}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsValidEmail(e.target.validity.valid);
                  }}
                  autoComplete="email"
                />
              </FormControl>
              <Button
                borderLeftRadius={0}
                flexShrink={0}
                isLoading={isSubmitting}
                type="submit"
                mr={2}
                onClick={handleSubmit}
                colorScheme="purple"
              >
                Sign up
              </Button>
            </Flex>
          </form>
        </div>
      </Container>
    </Box>
  );
};
