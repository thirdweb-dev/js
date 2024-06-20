import { Box, DarkMode, Flex, SimpleGrid, Spinner } from "@chakra-ui/react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { DevRelEvent } from "components/devRelEvents/DevRelEvent";
import { HomepageFooter } from "components/footer/Footer";
import { Aurora } from "components/homepage/Aurora";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

export type LumaEvent = {
  api_id: string;
  event: {
    api_id: string;
    cover_url: string;
    name: string;
    description: string;
    series_api_id: string | null;
    start_at: string;
    duration_interval: string;
    end_at: string;
    geo_address_json: null;
    geo_latitude: null;
    geo_longitude: null;
    url: string;
    social_image_url: string;
    timezone: string;
    event_type: string;
    user_api_id: string;
  };
};
type LumaResponse = {
  entries: LumaEvent[];
  has_more: boolean;
  next_cursor: string;
};

function useLumaEvents() {
  const lumaEventsQuery = useQuery({
    queryKey: ["luma-events"],
    queryFn: async () => {
      const res = await fetch("/api/luma-events");
      if (!res.ok) {
        throw new Error("Failed to load events");
      }
      const data: LumaResponse = await res.json();
      return data.entries;
    },
  });

  return lumaEventsQuery;
}

const Events = () => {
  const lumaEventsQuery = useLumaEvents();

  return (
    <Box minH="calc(100vh - 72px)" overflow="hidden">
      <HomepageSection id="header">
        <Aurora
          pos={{ left: "50%", top: "50%" }}
          size={{ width: "2000px", height: "2000px" }}
          color={"hsl(280deg 78% 30% / 30%)"}
        />

        <Flex
          flexDir="column"
          align="center"
          gap={12}
          mt={{ base: 12, md: 24 }}
        >
          <Heading size="title.xl" textAlign="center">
            Upcoming Events
          </Heading>
        </Flex>

        {lumaEventsQuery.isLoading && (
          <Flex justify="center" align="center" height={200}>
            <Spinner size="lg" />
          </Flex>
        )}

        {lumaEventsQuery.data && lumaEventsQuery.data.length > 1 && (
          <SimpleGrid
            mt={10}
            flexDir="column"
            gap={8}
            columns={{ base: 1, md: 3 }}
          >
            {lumaEventsQuery.data.map(
              ({
                event: { name, start_at, description, url, social_image_url },
              }) => (
                <DevRelEvent
                  key={name}
                  title={name}
                  timestamp={start_at}
                  description={description}
                  link={url}
                  image={social_image_url}
                />
              ),
            )}
          </SimpleGrid>
        )}

        {lumaEventsQuery.data && lumaEventsQuery.data.length === 0 && (
          <Flex justify="center" align="center" height={300}>
            <Text textAlign="center" color="heading" size="body.lg">
              No upcoming events
            </Text>
          </Flex>
        )}

        {lumaEventsQuery.isError && (
          <Flex justify="center" align="center" height={300}>
            <Text textAlign="center" color="heading" size="body.lg">
              Failed to load upcoming events
            </Text>
          </Flex>
        )}
      </HomepageSection>
    </Box>
  );
};

const queryClient = new QueryClient();

const EventsPage: ThirdwebNextPage = () => {
  return (
    <DarkMode>
      <NextSeo title="events" />
      <Flex
        sx={{
          "--chakra-colors-heading": "#F2F2F7",
          "--chakra-colors-paragraph": "#AEAEB2",
          "--chakra-colors-borderColor": "rgba(255,255,255,0.1)",
        }}
        justify="center"
        flexDir="column"
        as="main"
        bg="#000"
      >
        <HomepageTopNav />
        <QueryClientProvider client={queryClient}>
          <Events />
        </QueryClientProvider>
        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};

EventsPage.pageId = PageId.Events;

export default EventsPage;
