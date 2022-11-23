import { PRODUCTS } from "../common/nav/Products";
import {
  Box,
  ButtonGroup,
  Container,
  DarkMode,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { SiDiscord } from "@react-icons/all-files/si/SiDiscord";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiInstagram } from "@react-icons/all-files/si/SiInstagram";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";
import { SiTiktok } from "@react-icons/all-files/si/SiTiktok";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { SiYoutube } from "@react-icons/all-files/si/SiYoutube";
import { Logo } from "components/logo";
import {
  Heading,
  LinkButton,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";

export const HomepageFooter: React.FC = () => {
  return (
    <Box bgColor="#111315" zIndex="100">
      <Container as="footer" maxW="container.page" color="gray.500">
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
                href="https://twitter.com/thirdweb"
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
                <Heading as="h5" size="label.lg">
                  Products
                </Heading>
                <Stack spacing="3" shouldWrapChildren>
                  {PRODUCTS.map((product, id) => (
                    <TrackedLink
                      key={id}
                      href={product.link}
                      category="footer"
                      label={product.label}
                    >
                      {product.name}
                    </TrackedLink>
                  ))}
                </Stack>
              </Stack>
              <Stack spacing="4" minW="36" flex="1">
                <Heading as="h5" size="label.lg">
                  Resources
                </Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink href="/about" category="footer" label="about">
                    About
                  </TrackedLink>
                  <TrackedLink
                    href="https://thirdweb.typeform.com/to/ZV3gUhiP"
                    isExternal
                    category="footer"
                    label="sales-form"
                  >
                    Partner with us
                  </TrackedLink>
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
                    href="https://blog.thirdweb.com/guides"
                    category="footer"
                    label="guides"
                  >
                    Guides
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
                    href="https://careers.thirdweb.com/"
                    category="footer"
                    label="careers"
                  >
                    Careers
                  </TrackedLink>
                </Stack>

                <Heading size="label.lg">Solutions</Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink
                    href="/solutions/commerce"
                    category="footer"
                    label="commerce"
                  >
                    Commerce
                  </TrackedLink>
                </Stack>
              </Stack>
              <Stack spacing="4" minW="36" flex="1">
                <Heading as="h5" size="label.lg">
                  SDKs
                </Heading>
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
                <Heading as="h5" size="label.lg">
                  Networks
                </Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink
                    href="/network/solana"
                    category="footer"
                    label="network-solana"
                  >
                    Solana
                  </TrackedLink>
                </Stack>
                <Heading as="h5" size="label.lg">
                  Faucets
                </Heading>
                <Stack spacing="3" shouldWrapChildren>
                  <TrackedLink
                    href="/faucet/solana"
                    category="footer"
                    label="faucet-solana"
                  >
                    Solana
                  </TrackedLink>
                </Stack>
              </Stack>
              <Stack spacing="4" minW="36" flex="1">
                <Heading as="h5" size="label.lg">
                  Legal
                </Heading>
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
