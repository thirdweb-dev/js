import { Box, Flex, Icon } from "@chakra-ui/react";
import { MaskedAvatar } from "components/contract-components/releaser/masked-avatar";
import { OgBrandIcon } from "components/og/og-brand-icon";
import {
  BASE_URL,
  OG_IMAGE_BASE_URL,
  OG_IMAGE_CACHE_VERSION,
} from "lib/constants";
import { useRouter } from "next/router";
import { VscFile } from "react-icons/vsc";
import { Heading } from "tw-components";
import { z } from "zod";

const OgProfileSchema = z.object({
  displayName: z.string(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  releaseCnt: z.string().optional(),
});

export function createProfileOGUrl(metadata: z.infer<typeof OgProfileSchema>) {
  const ogUrl = new URL(`${OG_IMAGE_BASE_URL}/api`);

  const url = new URL(`${BASE_URL}/_og/profile`);

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, item));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  url.searchParams.sort();

  ogUrl.searchParams.append("url", url.toString());
  ogUrl.searchParams.append("version", OG_IMAGE_CACHE_VERSION);

  return ogUrl.toString();
}

export default function OgProfileImage() {
  const router = useRouter();

  let metadata;

  try {
    metadata = OgProfileSchema.parse(router.query);
  } catch (err) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top={0}
      bottom={0}
      right={0}
      left={0}
      bg="black"
      overflow="hidden"
    >
      <Box
        position="absolute"
        left={0}
        bottom={0}
        top={0}
        right={0}
        bg="url(/assets/og-image/profile-bg.png)"
        bgSize="contain"
        bgRepeat="no-repeat"
        bgPosition="center"
        zIndex={-1}
      />

      <Flex
        p="70px"
        w="100%"
        height="100%"
        direction="column"
        justify="space-between"
      >
        <Flex direction="column" w="100%" gap="20px">
          <MaskedAvatar
            boxSize={128}
            src={
              metadata.avatar ||
              `https://source.boringavatars.com/marble/120/${metadata.displayName}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51&square=true`
            }
          />
          <Heading size="title.lg" fontSize="64px" noOfLines={1}>
            {metadata.displayName}
          </Heading>
          {metadata.bio && (
            <Heading
              size="subtitle.lg"
              lineHeight={1.5}
              fontSize="36px"
              noOfLines={2}
            >
              {metadata.bio}
            </Heading>
          )}
        </Flex>
        <Flex direction="row" justify="space-between" align="flex-end">
          {metadata.releaseCnt ? (
            <Flex gap="12px" align="center">
              <Icon color="rgba(255,255,255,.5)" as={VscFile} boxSize="24px" />
              <Heading
                noOfLines={1}
                maxW="50vw"
                color="rgba(255,255,255,.8)"
                fontFamily="mono"
                size="subtitle.lg"
              >
                {metadata.releaseCnt}
                {` ${
                  parseInt(metadata.releaseCnt) > 1 ? "releases" : "release"
                }`}
              </Heading>
            </Flex>
          ) : (
            <div />
          )}
          <OgBrandIcon />
        </Flex>
      </Flex>
    </Box>
  );
}
