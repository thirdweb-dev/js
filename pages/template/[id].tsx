import { Box, DarkMode, Flex, Image } from "@chakra-ui/react";
import { CopyButton } from "components/homepage/AnimatedCLICommand/AnimatedCLICommand";
import { ProductButton } from "components/product-pages/common/ProductButton";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { GetStaticPaths, GetStaticProps } from "next";
import { PageId } from "page-id";
import { TemplateCardProps, templates } from "pages/templates";
import React from "react";
import {
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedLink,
  TrackedLinkButton,
} from "tw-components";
import { ThirdwebNextPage } from "utils/types";

type TemplateContentsProps = {
  overview: React.ReactNode;
  featurePoints: React.ReactNode[];
  runningLocally?: React.ReactNode;
};

const CodeBlock: React.FC<{ text: string }> = (props) => {
  return (
    <Flex
      border="1px solid rgba(255, 255, 255, 0.2)"
      borderRadius="md"
      flexShrink={0}
      py={3}
      px={4}
      my={4}
      minW={"300px"}
      gap={1}
      align="center"
      alignSelf="start"
    >
      <Text color="white" fontFamily="mono" fontSize="16px" fontWeight="500">
        <span>{props.text}</span>
      </Text>
      <CopyButton text={props.text} />
    </Flex>
  );
};

const TemplateContents: React.FC<TemplateContentsProps> = (props) => {
  return (
    <>
      <Heading as="h3" fontSize="24px" fontWeight={700} mt={12} mb={4}>
        Overview
      </Heading>

      {props.overview}

      {props.featurePoints.length > 0 && (
        <>
          <Box as="ul" listStyleType="inherit" pl={4} mt={4}>
            {props.featurePoints.map((feature, idx) => (
              <Box
                as="li"
                key={idx}
                fontWeight={400}
                fontSize={16}
                lineHeight={1.5}
                opacity={0.7}
                color="whiteAlpha.900"
                mb={2}
              >
                {feature}
              </Box>
            ))}
          </Box>
        </>
      )}

      <Heading as="h3" fontSize="24px" fontWeight={700} mt={12} mb={4}>
        Running locally
      </Heading>

      <Box
        fontWeight={400}
        fontSize={16}
        lineHeight={1.5}
        opacity={0.7}
        color="whiteAlpha.900"
        mb={2}
      >
        {props.runningLocally}
      </Box>
    </>
  );
};

// Use the "id" fields from the templates array of objects to create a mapping of contents for each template id
const templateContents: Record<(typeof templates)[number]["id"], JSX.Element> =
  {
    erc721: (
      <TemplateContents
        overview={
          <>
            <Text
              fontWeight={400}
              fontSize={16}
              lineHeight={1.5}
              opacity={0.7}
              color="whiteAlpha.900"
            >
              A web and mobile friendly page for users to claim NFTs from a
              smart contract implementing{" "}
              <Link
                href="https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Claimable"
                isExternal
                color="blue.300"
              >
                ERC721Claimable
              </Link>
              , such as the{" "}
              <Link
                href="https://thirdweb.com/thirdweb.eth/DropERC721"
                isExternal
                color="blue.300"
              >
                NFT Drop
              </Link>
              .
            </Text>
          </>
        }
        featurePoints={[
          <>
            Built with our{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/react/latest"
              color="blue.300"
            >
              React SDK
            </Link>
            .
          </>,
          <>Uses Vite, TypeScript, and Tailwind.</>,
          <>
            Render NFT metadata with the{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/react/latest/components/ThirdwebNftMedia"
              color="blue.300"
            >
              NFT Renderer
            </Link>{" "}
            UI Component.
          </>,
          <>
            Configure wallet options with the{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/react/latest/components/ConnectWallet"
              color="blue.300"
            >
              Connect Wallet Button
            </Link>{" "}
            UI Component.
          </>,
          <>
            View{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/references/react/latest/useMetadata"
              color="blue.300"
            >
              contract metadata
            </Link>{" "}
            such as the name, remaining & total supply, description, etc.
          </>,
          <>
            Claim NFTs from the smart contract under the criteria of{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/glossary/claim-phases"
              color="blue.300"
            >
              claim phases
            </Link>
            .
          </>,
          <>Compatible with all EVM chains.</>,
        ]}
        runningLocally={
          <div>
            Deploy a new{" "}
            <Link
              href="https://thirdweb.com/thirdweb.eth/DropERC721"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              NFT Drop
            </Link>{" "}
            or import your existing one using the{" "}
            <Link
              href="https://thirdweb.com/dashboard"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              dashboard
            </Link>
            .
            <br />
            <br />
            Configure your smart contract address and chain name in the{" "}
            <Link
              href="https://github.com/thirdweb-example/nft-drop/blob/main/src/consts/parameters.ts"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              consts/parameters.ts
            </Link>{" "}
            file.
            <br />
            <br />
            Run the application from the command line:
            <CodeBlock text={"npm run dev"} />
            This will make the application available to preview at{" "}
            <Link
              href="http://localhost:3000"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              http://localhost:3000
            </Link>
            .
          </div>
        }
      />
    ),
    "marketplace-v3": (
      <TemplateContents
        overview={
          <>
            <Text
              fontWeight={400}
              fontSize={16}
              lineHeight={1.5}
              opacity={0.7}
              color="whiteAlpha.900"
            >
              Create your own NFT marketplace where users can buy and sell NFTs
              from your NFT collection. This template provides the foundation
              for building an NFT marketplace application.
            </Text>
          </>
        }
        featurePoints={[
          <>
            Built with our{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/react/latest"
              color="blue.300"
            >
              React SDK
            </Link>
            .
          </>,
          <>Uses Next.js, TypeScript, and CSS Modules.</>,
          <>
            Display all NFTs from your collection using the{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/react/latest/components/ThirdwebNftMedia"
              color="blue.300"
            >
              NFT Media Renderer
            </Link>{" "}
            UI component.
          </>,
          <>
            Allow users to buy, sell and make offers on NFTs in your collection.
          </>,
          <>Supports both direct listings and english auction sales.</>,
          <>
            You control the platform fees of each sale made on the smart
            contract.
          </>,
          <>Compatible with all EVM chains.</>,
        ]}
        runningLocally={
          <div>
            Deploy a new{" "}
            <Link
              href="https://thirdweb.com/thirdweb.eth/MarketplaceV3"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              Marketplace V3
            </Link>{" "}
            smart contract using the{" "}
            <Link
              href="https://thirdweb.com/dashboard"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              dashboard
            </Link>
            .
            <br />
            <br />
            Configure your smart contract address and chain name in the{" "}
            <Link
              href="https://github.com/thirdweb-example/marketplace-v3/blob/main/const/contractAddresses.ts"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              const/contractAddresses.ts
            </Link>{" "}
            file.
            <br />
            <br />
            Run the application from the command line:
            <CodeBlock text={"npm run dev"} />
            This will make the application available to preview at{" "}
            <Link
              href="http://localhost:3000"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              http://localhost:3000
            </Link>
            .
          </div>
        }
      />
    ),
    "nft-gallery": (
      <TemplateContents
        overview={
          <>
            <Text
              fontWeight={400}
              fontSize={16}
              lineHeight={1.5}
              opacity={0.7}
              color="whiteAlpha.900"
            >
              Showcase your NFT collection with a gallery application that
              allows users to view the metadata of all NFTs in your collection.
            </Text>
          </>
        }
        featurePoints={[
          <>
            Built with our{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/react/latest"
              color="blue.300"
            >
              React SDK
            </Link>
            .
          </>,
          <>Uses Vite, TypeScript, and Tailwind.</>,
          <>Compatible with both ERC721 and ERC1155 NFT collections.</>,
          <>
            Display all NFTs from your collection using the{" "}
            <Link
              fontWeight="500"
              isExternal
              href="https://portal.thirdweb.com/react/latest/components/ThirdwebNftMedia"
              color="blue.300"
            >
              NFT Media Renderer
            </Link>{" "}
            UI component.
          </>,
          <>Search for NFTs by token ID, or paginate through all NFTs.</>,
          <>Compatible with all EVM chains.</>,
        ]}
        runningLocally={
          <div>
            Deploy a new{" "}
            <Link
              href="https://thirdweb.com/thirdweb.eth/TokenERC721"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              NFT collection
            </Link>{" "}
            or import your existing one using the{" "}
            <Link
              href="https://thirdweb.com/dashboard"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              dashboard
            </Link>
            .
            <br />
            <br />
            Set your smart contract address and chain name in the{" "}
            <Link
              href="https://github.com/thirdweb-example/nft-gallery/blob/main/src/consts/parameters.ts"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              consts/parameters.ts
            </Link>{" "}
            file.
            <br />
            <br />
            Run the application from the command line:
            <CodeBlock text={"npm run dev"} />
            This will make the application available to preview at{" "}
            <Link
              href="http://localhost:3000"
              isExternal
              color="blue.300"
              fontWeight="500"
            >
              http://localhost:3000
            </Link>
            .
          </div>
        }
      />
    ),
  };

type TemplatePageProps = {
  template: TemplateCardProps;
};

const TemplatePage: ThirdwebNextPage = (props: TemplatePageProps) => {
  const contents = templateContents[props.template.id];

  return (
    <DarkMode>
      <Flex
        sx={{
          // overwrite the theme colors because the page is *always* in "dark mode"
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
        }}
        justify="center"
        flexDir="column"
        as="main"
      >
        <HomepageTopNav />

        <Flex
          pt={{ base: 4, md: 24 }}
          px={{ base: 4, md: 8 }}
          ml="auto"
          mr="auto"
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "baseline", md: "flex-start" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          gap={{ base: 8, md: 0 }}
          maxWidth={1280}
          mb={16}
        >
          <Box
            maxWidth={{ base: "100%", md: 440 }}
            pr={{ base: 0, md: 8 }}
            position={{ base: "static", md: "sticky" }}
            top={{ base: "auto", md: 24 }}
          >
            <Image
              src={props.template.img}
              alt={`Screenshot of ${props.template.title} template`}
              width="100%"
              height={{ base: "auto", md: 442 }}
              objectFit="cover"
              mb={12}
              borderRadius={8}
              display={{ base: "block", md: "none" }}
            />

            <Heading as="h1" fontSize="48px" fontWeight={700}>
              {props.template.title}
            </Heading>
            <Text
              mt={4}
              fontWeight={500}
              fontSize={16}
              lineHeight={1.5}
              opacity={0.7}
              color="whiteAlpha.900"
            >
              {props.template.description}
            </Text>
            <Flex
              direction="row"
              alignItems="center"
              gap={1}
              my={4}
              flexWrap="wrap"
            >
              {props.template.tags.map((tag, idx) => (
                <Box
                  as="div"
                  key={idx}
                  color="whiteAlpha.700"
                  border="1px solid #383838"
                  borderRadius="8px"
                  height="26px"
                  padding="6px 12px"
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  mt={1}
                >
                  <Text
                    as="span"
                    fontSize="12px"
                    fontWeight={500}
                    lineHeight={1.2}
                    letterSpacing="-0.015em"
                    opacity={0.7}
                    color="whiteAlpha.900"
                  >
                    {tag}
                  </Text>
                </Box>
              ))}
            </Flex>

            <Box my={8}>
              <Text
                textTransform="uppercase"
                fontWeight={600}
                color="#646D7A"
                letterSpacing="0.1em"
                fontSize="12px"
              >
                Author
              </Text>
              <Flex direction="row" alignItems="center" mt={2}>
                <Image
                  src={props.template.authorIcon}
                  alt={`Icon of ${props.template.authorENS}`}
                  width="16px"
                  height="16px"
                  mr={1}
                />
                <Text
                  as="span"
                  color="whiteAlpha.900"
                  lineHeight={1.5}
                  fontSize="12px"
                  fontWeight={500}
                  letterSpacing="-0.02em"
                  opacity={0.75}
                >
                  {props.template.authorENS}
                </Text>
              </Flex>
            </Box>

            <Flex mt={8}>
              <ProductButton
                title={"View Demo"}
                href={props.template.homepage}
                color="blackAlpha.900"
                bg="white"
                height="44px"
                width="149px"
                fontSize="14px"
                lineHeight="20px"
                fontWeight={600}
                iconColor="blackAlpha.900"
              />
              <LinkButton
                as={TrackedLink}
                variant="outline"
                borderWidth="2px"
                w="full"
                py={"22px"}
                textAlign="center"
                borderRadius="md"
                href={props.template.repo}
                isExternal={true}
                noIcon
                height="44px"
                width="149px"
                fontSize="14px"
                lineHeight="20px"
                fontWeight={600}
                ml={4}
              >
                View Repo
              </LinkButton>
            </Flex>
          </Box>

          <Box
            borderLeft={{
              base: "none",
              md: "1px solid #222222",
            }}
            pl={{ base: 0, md: 16 }}
            minHeight="75vh"
            height={"100%"}
          >
            <Image
              src={props.template.img}
              alt={`Screenshot of ${props.template.title} template`}
              width="100%"
              height={{ base: "auto", md: 442 }}
              objectFit="cover"
              borderRadius={8}
              display={{ base: "none", md: "block" }}
            />

            {props.template.contractLink && (
              <Flex
                w="full"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="2xl"
                flexShrink={0}
                p={8}
                mt={6}
                gap={1}
                align="center"
                justify="space-between"
              >
                <Flex flexDir="column">
                  <Text
                    color="whiteAlpha.900"
                    fontWeight={500}
                    fontSize={18}
                    lineHeight={1.5}
                    opacity={0.7}
                  >
                    This template is using
                  </Text>

                  <Link
                    href={props.template.contractLink}
                    isExternal
                    color="blue.300"
                    fontWeight={600}
                    fontSize={28}
                  >
                    {props.template.contractName} Contract
                  </Link>
                </Flex>

                <TrackedLinkButton
                  href={props.template.contractLink}
                  category="template-page"
                  label="deploy-your-own"
                  bg="white"
                  color="blackAlpha.900"
                  fontWeight={600}
                  _hover={{
                    bg: "white",
                    opacity: 0.8,
                  }}
                  isExternal
                  noIcon
                >
                  Deploy your own
                </TrackedLinkButton>
              </Flex>
            )}

            <Heading as="h2" fontSize="32px" fontWeight={700} mt={16}>
              Get started
            </Heading>
            <Text
              mt={4}
              fontWeight={500}
              fontSize={16}
              lineHeight={1.5}
              opacity={0.7}
              color="whiteAlpha.900"
            >
              Kick start your project by copying this command into your CLI.
            </Text>
            <CodeBlock
              text={`npx thirdweb create --template ${props.template.id}`}
            />
            {contents}
          </Box>
        </Flex>
      </Flex>
    </DarkMode>
  );
};

export default TemplatePage;
TemplatePage.pageId = PageId.Template;

// server side ---------------------------------------------------------------
export const getStaticProps: GetStaticProps<TemplatePageProps> = async (
  ctx,
) => {
  try {
    // Using the id from the context, we can fetch the data for the template from GitHub.
    const { id } = ctx.params as { id: string };

    const template = templates.find((t) => t.id === id);

    if (!template) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        template,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: false,
    paths: templates.map((template) => ({
      params: {
        id: template.id,
      },
    })),
  };
};
