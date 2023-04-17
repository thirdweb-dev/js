import { Box, DarkMode, Flex, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { DevRelEvent } from "components/devRelEvents/DevRelEvent";
import { HomepageFooter } from "components/footer/Footer";
import { Aurora } from "components/homepage/Aurora";
import { HomepageTopNav } from "components/product-pages/common/Topnav";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { useEffect, useState } from "react";
import { Heading } from "tw-components";
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

const EventsPage: ThirdwebNextPage = () => {
  const numberOfSkeletons = 1;
  const skeletonsArray = new Array(numberOfSkeletons).fill(null);

  const [lumaEvents, setLumaEvents] = useState<LumaEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/luma-events");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data: LumaResponse = await res.json();
        setLumaEvents(data.entries);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <DarkMode>
      <NextSeo title="events" />
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
        bg="#000"
      >
        <HomepageTopNav />

        <Box
          maxW="100vw"
          mt="-100px"
          overflowX="hidden"
          minH="100vh"
          pt={20}
          overflow="hidden"
        >
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
            <SimpleGrid
              mt={10}
              flexDir="column"
              gap={8}
              columns={{ base: 1, md: 3 }}
            >
              {lumaEvents.length > 0
                ? lumaEvents.map(
                    ({
                      event: {
                        name,
                        start_at,
                        description,
                        url,
                        social_image_url,
                      },
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
                  )
                : skeletonsArray.map((_, index) => (
                    <Skeleton key={index} borderRadius="lg">
                      <DevRelEvent
                        title=""
                        timestamp=""
                        description=""
                        link=""
                        image=""
                      />
                    </Skeleton>
                  ))}
            </SimpleGrid>
          </HomepageSection>
        </Box>
        <HomepageFooter />
      </Flex>
    </DarkMode>
  );
};

EventsPage.pageId = PageId.Events;

export default EventsPage;
