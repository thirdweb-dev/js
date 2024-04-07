import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from "@chakra-ui/react";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Checkbox } from "tw-components";
import { useRouter } from "next/router";
import { TEMPLATE_TAGS, TemplateTagId } from "data/templates/tags";

type FilterItem = {
  label: string;
  tags: (typeof TEMPLATE_TAGS)[number][];
};
const filterItems: FilterItem[] = [
  {
    label: "Products",
    tags: [
      {
        id: "connect",
        displayValue: "Connect",
      },
      {
        id: "contract",
        displayValue: "Contract",
      },
      {
        id: "engine",
        displayValue: "Engine",
      },
    ],
  },
  {
    label: "Use cases",
    tags: [
      {
        id: "nft",
        displayValue: "NFT",
      },
      {
        id: "loyalty",
        displayValue: "Loyalty",
      },
      {
        id: "gaming",
        displayValue: "Gaming",
      },
      {
        id: "phygital",
        displayValue: "Phygital",
      },
      {
        id: "dao",
        displayValue: "DAO",
      },
    ],
  },
  {
    label: "Platforms",
    tags: [
      {
        id: "typescript",
        displayValue: "TypeScript",
      },
      {
        id: "react",
        displayValue: "React",
      },
      {
        id: "unity",
        displayValue: "Unity",
      },
    ],
  },
];

type FilterProps = {
  queriedTags: TemplateTagId[];
  expandAll?: boolean;
  setSelectedTags: Dispatch<SetStateAction<TemplateTagId[]>>;
};

const FilterMenu: React.FC<FilterProps> = ({
  queriedTags,
  expandAll,
  setSelectedTags,
}: FilterProps) => {
  const router = useRouter();
  // const trackEvent = useTrack();
  const handleToggleTag = (
    event: ChangeEvent<HTMLInputElement>,
    tagId: TemplateTagId,
  ) => {
    const isSelected = event.target.checked;
    if (isSelected) {
      queriedTags.push(tagId);
    } else {
      queriedTags = queriedTags.filter((id) => id !== tagId);
    }
    setSelectedTags([...queriedTags]);
    if (!router) {
      return;
    }
    const queryParams = new URLSearchParams(window.location.search);
    if (queriedTags.length) {
      queryParams.set("tags", queriedTags.join(","));
    } else {
      queryParams.delete("tags");
    }
    router.push(`?${queryParams.toString()}`, undefined, { shallow: true });
  };
  return (
    <Flex flexDir={"column"} minW={"180px"} mr={{ lg: "30px" }}>
      {filterItems.map((item) => (
        <Accordion
          defaultIndex={expandAll ? [0] : undefined}
          allowMultiple
          key={item.label}
        >
          <AccordionItem borderBottom={"none"}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {item.label} ({item.tags.length})
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} display="flex" flexDir="column">
              {item.tags.map((tag) => {
                const selected = queriedTags.includes(tag.id);
                return (
                  <Checkbox
                    isChecked={selected}
                    key={tag.id}
                    onChange={(e) => handleToggleTag(e, tag.id)}
                  >
                    {tag.displayValue}
                  </Checkbox>
                );
              })}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      ))}
      <br />
    </Flex>
  );
};

export default FilterMenu;
