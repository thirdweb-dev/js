import {
  DarkMode,
  Flex,
  LinkBox,
  SimpleGrid,
  Image,
  Box,
  LinkOverlay,
  InputGroup,
  InputLeftElement,
  Icon,
  Input,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { HomepageFooter } from "components/footer/Footer";
import { GetStartedSection } from "components/homepage/sections/GetStartedSection";
import { NewsletterSection } from "components/homepage/sections/NewsletterSection";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { NextSeo } from "next-seo";
import { Heading, Text, TrackedLink } from "tw-components";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import FilterMenu from "./FilterMenu";
import { FiSearch, FiX } from "react-icons/fi";
import Router, { useRouter } from "next/router";
import { TEMPLATE_DATA, TemplateCardProps } from "data/templates/templates";
import { TEMPLATE_TAGS, TemplateTagId } from "data/templates/tags";
import { useDebounce } from "hooks/common/useDebounce";

type TemplateWrapperProps = {
  title: string;
  description: string;
  data: TemplateCardProps[];
  showFilterMenu?: boolean;
  children?: ReactNode;
};

export function filterTemplates(
  tagIds: TemplateTagId[],
  keyword: string,
  showFilterMenu?: boolean,
  defaultData?: TemplateCardProps[],
) {
  let _templates = defaultData || TEMPLATE_DATA;
  if (tagIds.length && showFilterMenu) {
    _templates = TEMPLATE_DATA.filter((item) =>
      tagIds.every((tagId) => item.tags.includes(tagId)),
    );
  }

  // Don't search if there's only one letter
  if (keyword && keyword.length >= 2) {
    const _keyword = keyword.toLowerCase() as TemplateTagId;
    _templates = _templates.filter(
      (template) =>
        template.tags.includes(_keyword) ||
        template.keywords?.includes(_keyword) ||
        template.title.toLowerCase().includes(_keyword) ||
        template.description.toLowerCase().includes(_keyword),
    );
  }
  return _templates;
}

const TemplateWrapper = (props: TemplateWrapperProps) => {
  const router = useRouter();
  const _defaultKeywords = (router?.query?.keyword as string) || "";
  const _defaultTagIds = router?.query?.tags
    ? ((router.query.tags as string)
        .split(",")
        // Remove invalid tags
        .filter((tag) =>
          TEMPLATE_TAGS.find((o) => o.id === tag),
        ) as TemplateTagId[])
    : [];

  return (
    <Content
      key={String(router.isReady)}
      _defaultKeywords={_defaultKeywords}
      _defaultTagIds={_defaultTagIds}
      {...props}
    />
  );
};

export default TemplateWrapper;

type TemplatesContentProps = {
  _defaultKeywords?: string;
  _defaultTagIds?: TemplateTagId[];
} & TemplateWrapperProps;

const Content = (props: TemplatesContentProps) => {
  const router = useRouter();
  const {
    _defaultTagIds,
    _defaultKeywords,
    title,
    description,
    data,
    showFilterMenu,
    children,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTags, setSelectedTags] = useState<TemplateTagId[]>(
    _defaultTagIds || [],
  );
  const [keyword, setKeyword] = useState<string>(_defaultKeywords || "");
  const debouncedSearchValue = useDebounce(keyword, 100);
  const path = router.asPath.split("?")[0];
  const push = Router.push;
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (debouncedSearchValue) {
      queryParams.set("keyword", debouncedSearchValue);
    } else {
      queryParams.delete("keyword");
    }
    if (path.startsWith("/templates/tag/")) {
      push({ pathname: path, query: queryParams.toString() }, undefined, {
        shallow: true,
      });
    } else {
      push(`?${queryParams.toString()}`, undefined, {
        shallow: true,
      });
    }
  }, [debouncedSearchValue, path, push]);

  const templates = useMemo(() => {
    return filterTemplates(
      selectedTags,
      debouncedSearchValue,
      showFilterMenu,
      data,
    );
  }, [selectedTags, debouncedSearchValue, showFilterMenu, data]);

  return (
    <DarkMode>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
        }}
      />
      <Flex
        sx={{
          // overwrite the theme colors because the home page is *always* in "dark mode"
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
          minH={275}
          pt="20px"
          w={"full"}
          bgImage="url('/assets/templates/template_banner.jpg')"
          bgSize="cover"
          bgPosition="center"
          bgRepeat="no-repeat"
          mb={20}
        >
          <Flex
            flexDir={{ base: "column", lg: "row" }}
            m={"auto"}
            justifyContent={"space-between"}
            w={"92vw"}
            maxW={"1150px"}
          >
            <Flex flexDir={"column"} gap={4}>
              <Heading
                fontSize={{ base: "48px", md: "48px" }}
                fontWeight={700}
                letterSpacing="-0.04em"
              >
                Templates
              </Heading>
              <Text maxW={"820px"} fontSize={"16px"}>
                Discover a comprehensive web3 developer resource that combines
                Connect, Contracts and Engine projects on top of the advanced
                thirdweb platform. Enhance your skills and stay ahead of the
                curve with the latest advancements in web3 technology.
              </Text>
              <InputGroup mb={10} w={"500px"} maxW={"90vw"}>
                <InputLeftElement>
                  <Icon as={FiSearch} opacity={0.5} />
                </InputLeftElement>
                <Input
                  htmlSize={10}
                  variant="outline"
                  spellCheck="false"
                  autoComplete="off"
                  bg="black"
                  placeholder="Search by keywords"
                  borderColor="borderColor"
                  onChange={(e) => setKeyword(e.target.value)}
                  defaultValue={_defaultKeywords || ""}
                  ref={inputRef}
                />
                {keyword && (
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      aria-label="Clear search"
                      variant="ghost"
                      icon={<Icon as={FiX} />}
                      onClick={() => {
                        setKeyword("");
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                      }}
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </Flex>
            <Image
              display={{ base: "none", lg: "block" }}
              src="/assets/templates/template_side_img.png"
              style={{ height: "200px", width: "auto" }}
            ></Image>
          </Flex>
        </Flex>
        <HomepageSection pb={24} ml="auto" mr="auto">
          {children || null}
          {showFilterMenu && (
            <Box display={{ base: "block", lg: "none" }}>
              <FilterMenu
                queriedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
            </Box>
          )}

          <Flex
            key={String(router.isReady)}
            direction={{ base: "column", lg: "row" }}
            gap={4}
          >
            {showFilterMenu && (
              <Box
                display={{ base: "none", lg: "block" }}
                // position="sticky"
                // top="40"
              >
                <FilterMenu
                  queriedTags={selectedTags}
                  expandAll={true}
                  setSelectedTags={setSelectedTags}
                />
              </Box>
            )}

            {templates.length > 0 ? (
              <SimpleGrid
                columns={{ lg: 3, md: 2, base: 1 }}
                gap={6}
                margin="0 auto"
              >
                {templates.map((template, idx) => (
                  <TemplateCard key={template.title + idx} {...template} />
                ))}
              </SimpleGrid>
            ) : (
              <Flex flexDir="column" justifyItems={"center"} width={"full"}>
                <Box marginX={"auto"}>
                  <FiSearch size={50} />
                </Box>
                <Text align={"center"} mt={"20px"}>
                  No results found. Try adjusting your filters.
                </Text>
              </Flex>
            )}
          </Flex>
        </HomepageSection>
      </Flex>
      <GetStartedSection />
      <NewsletterSection />
      <HomepageFooter />
    </DarkMode>
  );
};

export const getDisplayTagFromTagId = (tagId: TemplateTagId) => {
  // "loyalty-card" -> "Loyalty Card"
  return TEMPLATE_TAGS.find((item) => item.id === tagId)?.displayValue || "";
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  description,
  img,
  hoverBorderColor,
  tags,
  authorENS,
  authorIcon,
}) => {
  return (
    <Flex
      as={LinkBox}
      overflow="hidden"
      direction="column"
      zIndex={10}
      background="rgba(0,0,0,0.4)"
      boxShadow={`0 0 0 1px ${hoverBorderColor}`}
      borderRadius="8px"
      transition="box-shadow 300ms ease"
      _hover={{
        boxShadow: `0 0 80px ${hoverBorderColor}`,
      }}
    >
      <Image
        src={img}
        alt=""
        width="100%"
        height={{ lg: 196, base: 196 }}
        objectFit="cover"
      />
      <Flex
        direction="column"
        justifyContent="space-between"
        p={{ base: 6, lg: 8 }}
        py={{ base: 10 }}
        flexGrow={1}
      >
        <Box>
          <Heading as="h2" fontSize="20px" mb={3}>
            <TrackedLink
              as={LinkOverlay}
              href={`/templates/${id}`}
              category="templates"
              label={title.toLowerCase()}
              color="white"
              _hover={{
                textDecoration: "none",
              }}
            >
              {title}
            </TrackedLink>
          </Heading>

          <Flex direction="row" alignItems="center" gap={1} mb={3}>
            {tags.map((tag, idx) => {
              const tagValue = getDisplayTagFromTagId(tag);
              if (!tagValue) {
                return null;
              }
              return (
                <Box
                  as="a"
                  key={idx}
                  color="whiteAlpha.700"
                  border="1px solid #383838"
                  borderRadius="8px"
                  height="26px"
                  padding="6px 12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  href={`/templates/tag/${tag}`}
                  _hover={{ borderColor: "white", "& > *": { opacity: 1 } }}
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
                    {tagValue}
                  </Text>
                </Box>
              );
            })}
          </Flex>

          <Text
            size="body.md"
            lineHeight={1.7}
            color="whiteAlpha.700"
            opacity={0.7}
          >
            {description}
          </Text>
        </Box>
        <Flex
          direction="row"
          alignItems="center"
          w="fit-content"
          ml="auto"
          mt={6}
        >
          <Image
            src={authorIcon}
            alt={`Icon of ${authorENS}`}
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
            {authorENS}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
