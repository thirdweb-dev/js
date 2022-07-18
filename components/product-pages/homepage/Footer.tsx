import {
  Box,
  ButtonGroup,
  Container,
  DarkMode,
  Divider,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  LightMode,
  SimpleGrid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Logo } from "components/logo";
import { useForm } from "react-hook-form";
import { HiOutlineMail } from "react-icons/hi";
import { MdMarkEmailRead } from "react-icons/md";
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiLinkedin,
  SiTiktok,
  SiTwitter,
  SiYoutube,
} from "react-icons/si";
import {
  Button,
  Heading,
  LinkButton,
  Text,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import { sendEmailToConvertkit } from "utils/convertkit";

export const HomepageFooter: React.FC = () => {
  const { register, handleSubmit, setError } = useForm<{ email: string }>();
  const toast = useToast();

  return (
    <Box bgColor="#111315" zIndex="100">
      <Container as="footer" maxW="container.page" color="gray.500">
        <Stack
          spacing="8"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          py={{ base: "12", md: "16" }}
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

          <Flex
            as="form"
            direction={{ base: "column", sm: "row" }}
            mx="auto"
            maxW="md"
            gap={{ base: 4, md: 0 }}
            onSubmit={handleSubmit(async ({ email }) => {
              try {
                await sendEmailToConvertkit(email, [3136080]);
                toast({
                  position: "bottom",
                  variant: "solid",
                  title: "You're in!",
                  description: "Check your inbox to confirm your subscription.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              } catch (err) {
                console.error("failed to send email to convertkit", err);
                setError("email", {
                  message:
                    err instanceof Error ? err.message : "Something went wrong",
                });
              }
            })}
          >
            <InputGroup display="flex" size="md">
              <InputLeftElement pointerEvents="none">
                <Icon as={HiOutlineMail} />
              </InputLeftElement>
              <Input
                borderEndRadius={{ base: "md", md: "none" }}
                variant="outline"
                borderColor="rgba(255,255,255,.2)"
                placeholder="Email address"
                type="email"
                required
                {...register("email")}
              />
            </InputGroup>
            <LightMode>
              <Button
                borderStartRadius={{ base: "md", md: "none" }}
                variant="gradient"
                fromcolor="#1D64EF"
                tocolor="#E0507A"
                type="submit"
                borderRadius="md"
                borderWidth="1px"
                flexShrink={0}
              >
                <Box as="span">Subscribe</Box>
              </Button>
            </LightMode>
          </Flex>
        </Stack>

        <DarkMode>
          <Divider borderColor="rgba(255,255,255,0.1)" />
        </DarkMode>

        <Stack
          spacing="8"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          py={{ base: "12", md: "16" }}
        >
          <Stack spacing={{ base: "6", md: "8" }} align="start">
            <Logo color="#fff" />
            <ButtonGroup variant="ghost">
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://twitter.com/thirdweb_"
                icon={<SiTwitter fontSize="1.25rem" />}
                category="footer"
                aria-label="Twitter"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://discord.gg/thirdweb"
                aria-label="Discord"
                icon={<SiDiscord fontSize="1.25rem" />}
                category="footer"
                label="discord"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://www.youtube.com/channel/UCdzMx7Zhy5va5End1-XJFbA"
                aria-label="YouTube"
                icon={<SiYoutube fontSize="1.25rem" />}
                category="footer"
                label="youtube"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://www.linkedin.com/company/third-web/"
                aria-label="LinkedIn"
                icon={<SiLinkedin fontSize="1.25rem" />}
                category="footer"
                label="youtube"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://www.instagram.com/thirdweb/"
                aria-label="Instagram"
                icon={<SiInstagram fontSize="1.25rem" />}
                category="footer"
                label="instagram"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://www.tiktok.com/@thirdweb"
                aria-label="TikTok"
                icon={<SiTiktok fontSize="1.25rem" />}
                category="footer"
                label="tiktok"
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href="https://github.com/thirdweb-dev"
                aria-label="GitHub"
                icon={<SiGithub fontSize="1.25rem" />}
                category="footer"
                label="github"
              />
            </ButtonGroup>
          </Stack>
          <Flex
            direction={{ base: "column-reverse", md: "column", lg: "row" }}
            gap={{ base: "12", md: "8" }}
          >
            <SimpleGrid columns={{ base: 2, lg: 4 }} spacing="8">
              <Stack spacing="4" minW="36" flex="1">
                <Heading size="label.lg">Product</Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink
                    href="#features"
                    category="footer"
                    label="features"
                  >
                    Features
                  </TrackedLink>
                  <TrackedLink href="#fees" category="footer" label="pricing">
                    Pricing
                  </TrackedLink>
                  <TrackedLink
                    href="/dashboard"
                    category="footer"
                    label="dashboard"
                  >
                    Dashboard
                  </TrackedLink>
                </Stack>
              </Stack>
              <Stack spacing="4" minW="36" flex="1">
                <Heading size="label.lg">Company</Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com"
                    category="footer"
                    label="portal"
                  >
                    Docs
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="https://blog.thirdweb.com/"
                    category="footer"
                    label="blog"
                  >
                    Blog
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/guides"
                    category="footer"
                    label="guides"
                  >
                    Guides
                  </TrackedLink>
                </Stack>
              </Stack>
              <Stack spacing="4" minW="36" flex="1">
                <Heading size="label.lg">SDKs</Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/typescript"
                    category="footer"
                    label="javascript"
                  >
                    JavaScript
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/react"
                    category="footer"
                    label="react"
                  >
                    React
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/python"
                    category="footer"
                    label="python"
                  >
                    Python
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/contracts"
                    category="footer"
                    label="contracts"
                  >
                    Contracts
                  </TrackedLink>
                </Stack>
              </Stack>
              <Stack spacing="4" minW="36" flex="1">
                <Heading size="label.lg">Legal</Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink
                    isExternal
                    href="/privacy"
                    category="footer"
                    label="privacy"
                  >
                    Privacy Policy
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="/tos"
                    category="footer"
                    label="terms"
                  >
                    Terms of Service
                  </TrackedLink>
                </Stack>
              </Stack>
            </SimpleGrid>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};
