import {
  AspectRatio,
  Box,
  Flex,
  LinkBox,
  LinkOverlay,
  Stack,
} from "@chakra-ui/react";
import { ChakraNextImage, ChakraNextImageProps } from "components/Image";
import NextLink from "next/link";
import twAudited from "public/brand/thirdweb-audited-2.png";
import { Badge, Card, CardProps, Heading, Text } from "tw-components";

interface LinkCardProps extends CardProps {
  href: string;
  src: ChakraNextImageProps["src"];
  alt: string;
  title: string;
  subtitle?: string;
  largeIcon?: boolean;
  comingSoon?: boolean;
  erc?: string;
  audit?: string;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  href,
  src,
  alt,
  title,
  subtitle,
  largeIcon,
  comingSoon,
  erc,
  audit,
  ...restCardProps
}) => {
  return (
    <Card
      position="relative"
      as={LinkBox}
      {...restCardProps}
      {...(comingSoon
        ? {
            cursor: "not-allowed",
          }
        : {
            _hover: {
              borderColor: "blue.500",
            },
          })}
    >
      <Stack
        spacing={3}
        {...(comingSoon
          ? {
              filter: "grayscale(80%)",
              pointerEvents: "none",
            }
          : {})}
      >
        <AspectRatio ratio={1} w={largeIcon ? "100px" : "30px"}>
          <Box>
            <ChakraNextImage src={src} alt={alt} w="100%" />
          </Box>
        </AspectRatio>
        <Stack spacing={1}>
          <NextLink href={href} passHref>
            <LinkOverlay>
              <Flex gap={2}>
                <Heading size="title.sm" as="h3">
                  {title}
                </Heading>
                {audit && (
                  <Box width={20}>
                    <ChakraNextImage src={twAudited} alt="audited" />
                  </Box>
                )}
              </Flex>
            </LinkOverlay>
          </NextLink>
          <Flex justifyContent="center" alignItems="center" as={LinkBox}></Flex>
          {subtitle && <Text size="body.md">{subtitle}</Text>}
        </Stack>
      </Stack>

      {comingSoon ? (
        <Box position="absolute" top={0} right={0} p={1}>
          <Badge colorScheme="yellow" variant="solid">
            Coming soon
          </Badge>
        </Box>
      ) : (
        erc && (
          <Box position="absolute" top={0} right={0} p={1}>
            <Badge colorScheme="purple" variant="solid">
              {erc}
            </Badge>
          </Box>
        )
      )}
    </Card>
  );
};
