import { Flex, ButtonGroup, Divider, Tooltip, Box } from "@chakra-ui/react";
import { useState } from "react";
import { Card, Button, Text } from "tw-components";
import { EngineConfiguration } from "./configuration/engine-configuration";
import { EngineExplorer } from "./explorer/engine-explorer";
import { EngineOverview } from "./overview/engine-overview";
import { EnginePermissions } from "./permissions/engine-permissions";

interface EngineNavigationProps {
  instance: string;
}

export const EngineNavigation: React.FC<EngineNavigationProps> = ({
  instance,
}) => {
  const tabs = [
    {
      title: "Overview",
      isDisabled: false,
      disabledText: "",
      children: <EngineOverview instance={instance} />,
    },
    {
      title: "Explorer",
      isDisabled: false,
      disabledText: "",
      children: <EngineExplorer instance={instance} />,
    },
    {
      title: "Configuration",
      isDisabled: false,
      disabledText: "",
      children: <EngineConfiguration instance={instance} />,
    },
    {
      title: "Permissions",
      isDisabled: false,
      disabledText: "",
      children: <EnginePermissions instance={instance} />,
    },
  ];

  const [tab, setTab] = useState(tabs[0].title);

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={{ base: 0, md: 4 }} mb={4} mt={4}>
        <Box
          w="full"
          overflow={{ base: "auto", md: "hidden" }}
          pb={{ base: 4, md: 0 }}
        >
          <ButtonGroup
            size="sm"
            variant="ghost"
            spacing={2}
            w={(tabs.length + 1) * 95}
          >
            {tabs.map((tb) => (
              <Tooltip
                key={tb.title}
                p={0}
                bg="transparent"
                boxShadow={"none"}
                label={
                  tb.isDisabled ? (
                    <Card py={2} px={4} bgColor="backgroundHighlight">
                      <Text size="label.sm">
                        {tb?.disabledText || "Coming Soon"}
                      </Text>
                    </Card>
                  ) : (
                    ""
                  )
                }
              >
                <Button
                  isDisabled={tb.isDisabled}
                  type="button"
                  isActive={tab === tb.title}
                  _active={{
                    bg: "bgBlack",
                    color: "bgWhite",
                  }}
                  rounded="lg"
                  onClick={() => setTab(tb.title)}
                >
                  {tb.title}
                </Button>
              </Tooltip>
            ))}
          </ButtonGroup>
        </Box>
        <Divider />
      </Flex>

      {tabs.find((t) => t.title === tab)?.children}
    </Flex>
  );
};
