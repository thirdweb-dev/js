import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import type { ReactNode } from "react";
import { Heading, Text, TrackedLinkButton } from "tw-components";

interface LandingPlanProps {
  title: string;
  active?: boolean;
  description: string;
  listTitle?: string;
  list: { id: string; description: string | ReactNode }[];
  btnHref?: string;
  btnTitle?: string;
  trackingCategory: string;
}

export const LandingPlan = ({
  title,
  active,
  description,
  listTitle,
  list,
  btnHref,
  btnTitle,
  trackingCategory,
}: LandingPlanProps) => {
  return (
    <Flex
      flexDir="column"
      borderRadius="12px"
      border="1px solid #26282F"
      background="#000001"
      padding={{ base: "32px 36px", md: "49px 52px" }}
      minH={{ base: "auto", md: "665px" }}
      {...(active
        ? {
            boxShadow:
              "0px 7.768px 15.537px 0px rgba(202, 51, 255, 0.45), 0px -7.768px 15.537px 0px rgba(51, 133, 255, 0.45)",
          }
        : {})}
    >
      <Flex flexDir="column" flex={1}>
        <Heading as="label" size="title.lg">
          {title}
        </Heading>

        <Text size="body.lg" marginTop="14px" color="#B1B1B1">
          {description}
        </Text>

        <Flex marginTop="49px" flexDir="column" gap="16px">
          {listTitle && (
            <Text size="body.lg" color="#fff" fontWeight="bold">
              {listTitle}
            </Text>
          )}

          {list.map((listItem) => {
            return (
              <Flex key={listItem.id} alignItems="center" gap="12px">
                <ChakraNextImage
                  src={require("../../../public/assets/landingpage/check.svg")}
                  height="16px"
                  width="16px"
                  alt=""
                />
                {typeof listItem.description === "string" ? (
                  <Text size="body.lg" color="#B1B1B1">
                    {listItem.description}
                  </Text>
                ) : (
                  listItem.description
                )}
              </Flex>
            );
          })}
        </Flex>
      </Flex>

      {btnTitle && (
        <Flex w="full" alignItems="center" justifyContent="center">
          <TrackedLinkButton
            marginTop="48px"
            colorScheme="primary"
            category={trackingCategory}
            label={title.replace(" ", "_").toLowerCase()}
            href={btnHref ?? "/"}
            borderRadius="lg"
            py={6}
            px={6}
            bgColor="white"
            _hover={{
              bgColor: "white",
              opacity: 0.8,
            }}
            size="md"
            color="black"
            maxW="380px"
            minH="56px"
            w="full"
          >
            {btnTitle}
          </TrackedLinkButton>
        </Flex>
      )}
    </Flex>
  );
};
