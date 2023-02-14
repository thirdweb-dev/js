import {
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  List,
  ListItem,
} from "@chakra-ui/react";
import { defaultChains } from "@thirdweb-dev/chains";
import { ChainIcon } from "components/icons/ChainIcon";
import { StoredChain } from "contexts/configured-chains";
import {
  useConfiguredChains,
  useConfiguredChainsRecord,
} from "hooks/chains/configureChains";
import { useEffect, useMemo, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { Button, Heading } from "tw-components";

interface ConfiguredNetworkListProps {
  onClick: (network: StoredChain) => void;
  onAdd: (network: StoredChain) => void;
  activeNetwork?: StoredChain;
}

export const ConfiguredNetworkList: React.FC<ConfiguredNetworkListProps> = (
  props,
) => {
  const configuredChains = useConfiguredChains();
  const configuredChainsRecord = useConfiguredChainsRecord();

  const deletedDefaultChains: StoredChain[] = useMemo(() => {
    const _deletedDefaultChains: StoredChain[] = [];
    defaultChains.forEach((chain) => {
      if (
        !(chain.chainId in configuredChainsRecord) ||
        configuredChainsRecord[chain.chainId].isAutoConfigured
      ) {
        _deletedDefaultChains.push(chain);
      }
    });
    return _deletedDefaultChains;
  }, [configuredChainsRecord]);

  const { mainnets, testnets } = useMemo(() => {
    const _mainets: StoredChain[] = [];
    const _testnets: StoredChain[] = [];

    configuredChains.forEach((network) => {
      // don't show autoconfigured networks
      if (network.isAutoConfigured) {
        return;
      }

      if (network.testnet) {
        _testnets.push(network);
      } else {
        _mainets.push(network);
      }
    });

    return {
      mainnets: _mainets,
      testnets: _testnets,
    };
  }, [configuredChains]);

  return (
    <>
      <List
        spacing={0}
        overflow="auto"
        h={{ lg: "580px", base: "260px" }}
        sx={{
          maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "inputBg",
            borderRadius: 24,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "inputBgHover",
          },
        }}
        pb={8}
      >
        {mainnets.length > 0 && (
          <Box mb={8}>
            <Heading
              fontSize="md"
              fontWeight={600}
              color="accent.500"
              mb={4}
              ml={{ base: 4, md: 8 }}
            >
              Mainnets
            </Heading>
            {mainnets.map((network) => (
              <NetworkListItem
                isActive={props.activeNetwork === network}
                onClick={() => props.onClick(network)}
                name={network.name}
                key={network.name}
                img={network.icon?.url}
              />
            ))}
          </Box>
        )}

        {testnets.length > 0 && (
          <Box mb={8}>
            <Heading
              fontSize="md"
              fontWeight={600}
              color="accent.500"
              mb={4}
              ml={8}
            >
              Testnets
            </Heading>
            {testnets.map((network) => (
              <NetworkListItem
                isActive={props.activeNetwork === network}
                onClick={() => props.onClick(network)}
                name={network.name}
                key={network.slug}
                img={network.icon?.url}
                iconSizes={network.icon?.sizes}
              />
            ))}
          </Box>
        )}

        {deletedDefaultChains.length > 0 && (
          <>
            <Divider />
            <Box mb={8} mt={8}>
              <Heading
                fontSize="md"
                fontWeight={600}
                color="accent.500"
                mb={4}
                ml={8}
              >
                Removed Default Networks
              </Heading>
              {deletedDefaultChains.map((network) => (
                <AddNetworkItem
                  onAdd={() => {
                    props.onAdd(network);
                  }}
                  name={network.name}
                  key={network.slug}
                  img={network.icon?.url}
                  iconSizes={network.icon?.sizes}
                />
              ))}
            </Box>
          </>
        )}
      </List>
    </>
  );
};

const NetworkListItem: React.FC<{
  onClick: () => void;
  name: string;
  isActive: boolean;
  img?: string;
  iconSizes?: readonly number[];
}> = (props) => {
  const ref = useRef<HTMLLIElement | null>(null);

  // scroll into view when active
  useEffect(() => {
    if (props.isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [props.isActive]);

  return (
    <ListItem display="flex" alignItems="center" ref={ref}>
      <Button
        display="flex"
        justifyContent="flex-start"
        w="100%"
        alignItems="center"
        gap={3}
        _dark={{
          borderColor: props.isActive ? "blue.300" : "transparent",
          bg: props.isActive ? "inputBg" : "transparent",
        }}
        _light={{
          borderColor: props.isActive ? "gray.800" : "transparent",
          bg: props.isActive ? "inputBg" : "transparent",
        }}
        color="accent.900"
        fontWeight={500}
        fontSize="14px"
        px={{ base: 4, md: 8 }}
        borderLeft="2px solid transparent"
        py={4}
        _hover={{
          _dark: {
            bg: "inputBg",
          },
          _light: {
            bg: "inputBg",
          },
        }}
        onClick={props.onClick}
        textAlign="left"
        borderRadius={0}
        lineHeight={1.5}
      >
        <ChainIcon size={20} ipfsSrc={props.img} sizes={props.iconSizes} />
        {props.name}
      </Button>
    </ListItem>
  );
};

const AddNetworkItem: React.FC<{
  onAdd: () => void;
  name: string;
  img?: string;
  iconSizes?: readonly number[];
}> = (props) => {
  return (
    <ListItem display="flex" alignItems="center">
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        alignItems="center"
        gap={3}
        color="accent.900"
        fontWeight={500}
        fontSize="14px"
        px={{ base: 4, md: 8 }}
        py={3}
        lineHeight={1.5}
        bg="transparent"
      >
        <Flex alignItems="center" gap={3}>
          <ChainIcon size={20} ipfsSrc={props.img} sizes={props.iconSizes} />
          {props.name}
        </Flex>

        <IconButton
          w={6}
          h={6}
          px={1}
          py={1}
          minW={6}
          bg="inputBg"
          _hover={{ bg: "inputBgHover" }}
          icon={<Icon as={IoMdAdd} onClick={props.onAdd} />}
          aria-label="Add Network"
        />
      </Box>
    </ListItem>
  );
};
