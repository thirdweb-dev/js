import { useDashboardEVMChainId, useDashboardNetwork } from "@3rdweb-sdk/react";
import {
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AUDITED_BADGE_HEIGHT,
  BADGE_HEIGHT,
  BADGE_WIDTH,
} from "constants/badge-size";
import { useTrack } from "hooks/analytics/useTrack";
import { useMemo, useState } from "react";
import { FiCheck, FiCopy, FiShare } from "react-icons/fi";
import { Button, Card, Text } from "tw-components";

interface ContractBadgeProps {
  address: string;
}

export const ContractBadge: React.FC<ContractBadgeProps> = ({ address }) => {
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const { hasCopied, onCopy } = useClipboard(badgeCode, 3000);

  return (
    <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            trackEvent({
              category: "contract_badge",
              action: "click",
              label: "embed_badge",
            });
          }}
          leftIcon={<FiShare />}
        >
          Contract Badge
        </Button>
      </PopoverTrigger>
      <Card
        maxW="sm"
        w="auto"
        as={PopoverContent}
        bg="backgroundCardHighlight"
        mx={6}
        boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
      >
        <PopoverArrow bg="backgroundCardHighlight" />
        <PopoverBody>
          <Flex flexDir="column" gap={4}>
            <Flex alignItems="center" gap={3}>
              <Text>Theme</Text>
              <Select
                size="sm"
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Select>
            </Flex>
            <Flex alignItems="center" gap={3}>
              <Text>Preview</Text>
              <Image
                src={badgeUrl}
                w={BADGE_WIDTH}
                h={audited ? AUDITED_BADGE_HEIGHT : BADGE_HEIGHT}
                alt={address}
              />
            </Flex>
            <Button
              size="sm"
              colorScheme="purple"
              w="auto"
              onClick={() => {
                onCopy();
                trackEvent({
                  category: "contract_badge",
                  action: "click",
                  label: "copy_code",
                });
              }}
              leftIcon={hasCopied ? <FiCheck /> : <FiCopy />}
            >
              {hasCopied ? "Copied!" : "Copy code to clipboard"}
            </Button>
          </Flex>
        </PopoverBody>
      </Card>
    </Popover>
  );
};
