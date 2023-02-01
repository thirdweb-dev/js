import { useDashboardEVMChainId, useDashboardNetwork } from "@3rdweb-sdk/react";
import {
  Flex,
  GridItem,
  Image,
  Input,
  Select,
  SimpleGrid,
  useClipboard,
} from "@chakra-ui/react";
import {
  AUDITED_BADGE_HEIGHT,
  BADGE_HEIGHT,
  BADGE_WIDTH,
} from "constants/badge-size";
import { useTrack } from "hooks/analytics/useTrack";
import { useMemo, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { Button, Card, Heading, Text } from "tw-components";

interface ShareContractProps {
  address: string;
}

export const ShareContract: React.FC<ShareContractProps> = ({ address }) => {
  const trackEvent = useTrack();
  const network = useDashboardNetwork();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const audited = false;
  const activeChainId = useDashboardEVMChainId();

  const badgeUrl = useMemo(() => {
    const url = new URL("https://badges.thirdweb.com/contract");
    if (address) {
      url.searchParams.append("address", address);
    }
    if (theme) {
      url.searchParams.append("theme", theme);
    }
    if (activeChainId) {
      url.searchParams.append("chainId", activeChainId.toString());
    }
    return url.toString();
  }, [address, theme, activeChainId]);

  const badgeCode = `
    <a href="https://thirdweb.com/${network}/${address}?utm_source=contract_badge" target="_blank">
      <img width="${BADGE_WIDTH}" height="${
    audited ? AUDITED_BADGE_HEIGHT : BADGE_HEIGHT
  }" src="${badgeUrl}" alt="View contract" />
    </a>`;

  const contractLink = `https://thirdweb.com/${network}/${address}`;

  const { hasCopied: hasCopiedCode, onCopy: onCopyCode } = useClipboard(
    badgeCode,
    3000,
  );
  const { hasCopied: hasCopiedLink, onCopy: onCopyLink } = useClipboard(
    contractLink,
    3000,
  );

  return (
    <Flex direction="column" gap={6}>
      <Heading size="title.sm">Share Contract</Heading>
      <Card
        as={Flex}
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 8 }}
        gap={12}
        {...{ direction: "column" }}
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          <GridItem colSpan={{ md: 2 }} as={Flex} direction="column" gap={4}>
            <Heading size="label.lg">Add a contract badge to your app</Heading>
            <Text size="body.md">
              Let users know which contract they{"'"}re interacting with. Links
              directly to this contract&apos;s dashboard.
              {/* TODO: Add learn more */}
            </Text>
            <Flex mt={4} gap={2}>
              <Select
                w="auto"
                flexGrow={1}
                rounded="lg"
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              >
                <option value="dark">Dark theme</option>
                <option value="light">Light theme</option>
              </Select>
              <Button
                w="auto"
                minW="150px"
                onClick={() => {
                  onCopyCode();
                  trackEvent({
                    category: "share_contract",
                    action: "click",
                    label: "copy_code",
                  });
                }}
                leftIcon={hasCopiedCode ? <FiCheck /> : <FiCopy />}
              >
                {hasCopiedCode ? "Copied!" : "Copy code"}
              </Button>
            </Flex>
          </GridItem>
          <GridItem as={Flex} align="end" gap={3}>
            <Flex
              mt="auto"
              p={8}
              rounded="lg"
              w="full"
              maxH={32}
              h="full"
              justify="center"
              align="center"
              background="linear-gradient(150deg, #FF6929 -7.67%, #410AB6 100%)"
            >
              <Image
                src={badgeUrl}
                w={BADGE_WIDTH}
                h={audited ? AUDITED_BADGE_HEIGHT : BADGE_HEIGHT}
                alt={address}
              />
            </Flex>
          </GridItem>
        </SimpleGrid>
        <Flex direction="column" gap={4}>
          <Heading size="label.lg">Share this contract</Heading>
          <Flex gap={2} w="full">
            <Flex grow={1} position="relative">
              <Input
                rounded="lg"
                value={`https://thirdweb.com/${network}/${address}`}
                pr={10}
                readOnly
              />
              <Button
                minW="auto"
                h="auto"
                position="absolute"
                p={2}
                insetY={1}
                right={1}
                onClick={() => {
                  onCopyLink();
                  trackEvent({
                    category: "share_contract",
                    action: "click",
                    label: "copy_link",
                  });
                }}
              >
                {hasCopiedLink ? <FiCheck /> : <FiCopy />}
              </Button>
            </Flex>
            {/* TODO: Implement tweet it out button */}
            {/* <Button leftIcon={<SiTwitter />}>Tweet it out</Button>*/}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
