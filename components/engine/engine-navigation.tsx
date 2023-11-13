import {
  Flex,
  ButtonGroup,
  Divider,
  Tooltip,
  Box,
  Stack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, Button, Text, Heading } from "tw-components";
import { EngineConfiguration } from "./configuration/engine-configuration";
import { EngineExplorer } from "./explorer/engine-explorer";
import { EngineOverview } from "./overview/engine-overview";
import { EnginePermissions } from "./permissions/engine-permissions";
import { useTrack } from "hooks/analytics/useTrack";
import { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { FiArrowLeft } from "react-icons/fi";

interface EngineNavigationProps {
  instance: EngineInstance;
  setConnectedInstance: Dispatch<SetStateAction<EngineInstance | undefined>>;
}

export const EngineNavigation: React.FC<EngineNavigationProps> = ({
  instance,
  setConnectedInstance,
}) => {
  const tabs = [
    {
      title: "Overview",
      isDisabled: false,
      disabledText: "",
      children: <EngineOverview instance={instance.url} />,
    },
    {
      title: "Explorer",
      isDisabled: false,
      disabledText: "",
      children: <EngineExplorer instance={instance.url} />,
    },
    {
      title: "Configuration",
      isDisabled: false,
      disabledText: "",
      children: <EngineConfiguration instance={instance.url} />,
    },
    {
      title: "Permissions",
      isDisabled: false,
      disabledText: "",
      children: <EnginePermissions instance={instance.url} />,
    },
  ];

  const [tab, setTab] = useState(tabs[0].title);
  const trackEvent = useTrack();

  useEffect(() => {
    if (instance) {
      trackEvent({
        category: "engine",
        action: "navigate-tab",
        label: tab.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        url: instance.url,
      });
    }
  }, [instance, tab, trackEvent]);

  const onClickBack = () => {
    setConnectedInstance(undefined);
  };

  return (
    <Stack spacing={4}>
      <Button
        onClick={onClickBack}
        variant="link"
        leftIcon={<FiArrowLeft />}
        w="fit-content"
      >
        Back
      </Button>

      <Stack>
        <Heading size="title.lg" as="h1" isTruncated>
          {instance.name}
        </Heading>

        {!instance.name.startsWith("https://") && (
          <Text color="gray.600">{instance.url}</Text>
        )}
      </Stack>

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
    </Stack>
  );
};
