import {
  Box,
  DarkMode,
  Flex,
  FlexProps,
  FormControl,
  Icon,
  Image,
  Input,
  List,
  ListItem,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { PartnerLogo } from "components/partners/partner-logo";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { PageId } from "page-id";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { Button, Card, Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

interface FormSchema {
  firstname: string;
  lastname: string;
  email: string;
  "0-2/name": string;
  "0-2/website": string;
  jobtitle: string;
  "0-2/size_of_company": string;
  "0-2/product_type": string;
  products: string;
  "0-2/when_do_you_expect_to_launch_": string;
  how_did_you_hear_about_us_: string;
}

const ContactUs: ThirdwebNextPage = () => {
  const form = useForm<FormSchema>();
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  return (
    <DarkMode>
      <Flex
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
        }}
      >
        <HomepageTopNav />
        <HomepageSection py={24} mx="auto">
          <Flex
            flexDir={{ base: "column", lg: "row" }}
            justifyContent="space-between"
            gap={14}
          >
            <Flex flexDir="column" gap={8}>
              <Heading size="display.sm">
                Discover how <br />
                <Box
                  as="span"
                  bgClip="text"
                  bgGradient="linear(to-tr, #3387FF, #95BBF2)"
                >
                  Web3 can 10x <br /> your business.
                </Box>
              </Heading>
              <Text size="label.lg">
                Speak to our team of Web3 experts to <br />
                learn how we can get you shipping faster.
              </Text>
              <List as={Flex} flexDir="column" gap={3}>
                <ListItem>
                  <Flex gap={2} alignItems="center">
                    <Image
                      src="/assets/dashboard/extension-check.svg"
                      alt=""
                      objectFit="contain"
                      mb="2px"
                    />
                    <Text size="body.lg">
                      Technical support from real Web3 developers
                    </Text>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex gap={2} alignItems="center">
                    <Image
                      src="/assets/dashboard/extension-check.svg"
                      alt=""
                      objectFit="contain"
                      mb="2px"
                    />
                    <Text size="body.lg">
                      Help figuring out the solution you need
                    </Text>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex gap={2} alignItems="center">
                    <Image
                      src="/assets/dashboard/extension-check.svg"
                      alt=""
                      objectFit="contain"
                      mb="2px"
                    />
                    <Text size="body.lg">
                      Personalized demos of our products and solutions
                    </Text>
                  </Flex>
                </ListItem>
              </List>
              <TrustedBy display={{ base: "none", lg: "flex" }} />
            </Flex>
            <Card bgColor="white" p={{ base: 6, lg: 12 }} overflow="hidden">
              <Flex
                flexDir="column"
                gap={4}
                as="form"
                onSubmit={form.handleSubmit(async (data) => {
                  const fields = Object.keys(data).map((key) => ({
                    name: key,
                    value: (data as any)[key],
                  }));

                  setFormStatus("submitting");

                  try {
                    const response = await fetch("/api/hubspot", {
                      method: "POST",
                      body: JSON.stringify({ fields }),
                    });

                    if (!response.ok) {
                      throw new Error("Form submission failed");
                    }

                    await response.json();
                    setFormStatus("success");
                    form.reset();
                  } catch (error) {
                    setFormStatus("error");
                  }
                })}
              >
                <Flex gap={4}>
                  <FormControl gap={6} isRequired>
                    <Input
                      h={14}
                      borderColor="gray.300"
                      placeholder="First Name *"
                      color="black"
                      _placeholder={{ color: "black" }}
                      {...form.register("firstname", { required: true })}
                    />
                  </FormControl>
                  <FormControl gap={6} isRequired>
                    <Input
                      h={14}
                      borderColor="gray.300"
                      placeholder="Last Name *"
                      color="black"
                      _placeholder={{ color: "black" }}
                      {...form.register("lastname", { required: true })}
                    />
                  </FormControl>
                </Flex>
                <FormControl gap={6} isRequired>
                  <Input
                    h={14}
                    borderColor="gray.300"
                    placeholder="Your Company Email *"
                    type="email"
                    color="black"
                    _placeholder={{ color: "black" }}
                    {...form.register("email", { required: true })}
                  />
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Input
                    h={14}
                    borderColor="gray.300"
                    placeholder="Your Company *"
                    color="black"
                    _placeholder={{ color: "black" }}
                    {...form.register("0-2/name", { required: true })}
                  />
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Input
                    h={14}
                    borderColor="gray.300"
                    placeholder="Your Company Website URL *"
                    color="black"
                    _placeholder={{ color: "black" }}
                    {...form.register("0-2/website", { required: true })}
                  />
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Input
                    h={14}
                    borderColor="gray.300"
                    placeholder="Job Title *"
                    color="black"
                    _placeholder={{ color: "black" }}
                    {...form.register("jobtitle", { required: true })}
                  />
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Select
                    h={14}
                    borderColor="gray.300"
                    placeholder="Size of Company *"
                    color="black"
                    {...form.register("0-2/size_of_company", {
                      required: true,
                    })}
                  >
                    <option value="solo">Solo</option>
                    <option value="2-10">2-10</option>
                    <option value="11-49">11-49</option>
                    <option value="50-99">50-99</option>
                    <option value="100-249">100-249</option>
                    <option value="250+">250</option>
                  </Select>
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Select
                    h={14}
                    borderColor="gray.300"
                    placeholder="What industry is your company most closely aligned with? *"
                    color="black"
                    {...form.register("0-2/product_type", { required: true })}
                  >
                    <option value="Brand / Commerce">Brand / Commerce</option>
                    <option value="Game">Game</option>
                    <option value="Tech">Tech</option>
                    <option value="Protocols & Chains">
                      Protocols & Chains
                    </option>
                  </Select>
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Select
                    h={14}
                    borderColor="gray.300"
                    placeholder="What solution are you most interested in? *"
                    color="black"
                    {...form.register("products", { required: true })}
                  >
                    <option value="Gaming">Gaming</option>
                    <option value="CommerceKit">CommerceKit</option>
                    <option value="MintingAPI">Minting API</option>
                    <option value="Wallets">Wallets</option>
                    <option value="Marketplaces">Marketplaces</option>
                    <option value="Account Abstraction">
                      Account Abstraction
                    </option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Select
                    h={14}
                    borderColor="gray.300"
                    placeholder="When do you expect to launch? *"
                    color="black"
                    {...form.register("0-2/when_do_you_expect_to_launch_", {
                      required: true,
                    })}
                  >
                    <option value="ASAP">ASAP</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="1+ year">1+ year</option>
                  </Select>
                </FormControl>
                <FormControl gap={6} isRequired>
                  <Select
                    h={14}
                    borderColor="gray.300"
                    placeholder="How did you hear about us? *"
                    color="black"
                    {...form.register("how_did_you_hear_about_us_", {
                      required: true,
                    })}
                  >
                    <option value="Socials (Twitter, LinkedIn)">
                      Socials (Twitter, LinkedIn)
                    </option>
                    <option value="thirdweb Website">thirdweb Website</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                    <option value="Event">Event</option>
                  </Select>
                </FormControl>
                <Box color="white" mx={{ base: "auto", lg: "inherit" }}>
                  <Button
                    type="submit"
                    bg="black"
                    _hover={{ bg: "black", opacity: 0.8 }}
                    px={8}
                    py={6}
                    leftIcon={<Icon as={BsFillLightningChargeFill} />}
                    isDisabled={formStatus === "submitting"}
                  >
                    <Text color="white" size="label.lg">
                      {formStatus === "submitting" ? "Submitting..." : "Submit"}
                    </Text>
                  </Button>
                </Box>
                {formStatus === "success" && (
                  <Text color="green.600">
                    Thanks for submitting the form. Our team will respond within
                    48 hours.
                  </Text>
                )}
                {formStatus === "error" && (
                  <Text color="red.500">
                    Something went wrong. Please try again.
                  </Text>
                )}
              </Flex>
            </Card>
            <TrustedBy display={{ base: "flex", lg: "none" }} mt={0} />
          </Flex>
        </HomepageSection>
        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};

const TrustedBy: React.FC<FlexProps> = (flexProps) => {
  return (
    <Flex flexDir="column" gap={8} mt={10} {...flexProps}>
      <Heading size="subtitle.md" color="white">
        Trusted by leading companies
      </Heading>
      <SimpleGrid
        columns={{ base: 2, lg: 3 }}
        mx="auto"
        gap={6}
        px={{ base: 8, lg: 0 }}
      >
        <PartnerLogo partner="shopify" />
        <PartnerLogo partner="animoca" />
        <PartnerLogo partner="coinbase" />
        <PartnerLogo partner="polygon" />
        <PartnerLogo partner="gala_games" />
        <PartnerLogo partner="mirror" />
      </SimpleGrid>
    </Flex>
  );
};

ContactUs.pageId = PageId.ContactUs;

export default ContactUs;
