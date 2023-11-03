import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { Button, Heading, MenuItem, Text } from "tw-components";
import { shortenString } from "utils/usedapp-external";

interface ApiKeysMenuProps {
  apiKeys: ApiKey[];
  selectedKey: ApiKey;
  onSelect: (apiKey: ApiKey) => void;
}

export const ApiKeysMenu: React.FC<ApiKeysMenuProps> = ({
  apiKeys,
  selectedKey,
  onSelect,
}) => {
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            rightIcon={<FiChevronDown />}
            variant="outline"
            minW={60}
          >
            <Flex gap={2} alignItems="center">
              <Heading size="label.md" isTruncated>
                {selectedKey.name}
              </Heading>
              <Text isTruncated>({shortenString(selectedKey.key)})</Text>
            </Flex>
          </MenuButton>
          <MenuList>
            {apiKeys.map((apiKey) => (
              <MenuItem
                key={apiKey.id}
                value={apiKey.key}
                onClick={() => onSelect(apiKey)}
              >
                {apiKey.name} ({shortenString(apiKey.key)})
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};
