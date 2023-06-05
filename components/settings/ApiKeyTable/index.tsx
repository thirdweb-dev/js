import CopyApiKeyButton from "./CopyButton";
import EditApiKeyModal from "./EditModal";
import RevokeApiKeyButton from "./RevokeButton";
import { ApiKeyInfo } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, Icon, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { FiEdit2, FiMoreVertical } from "react-icons/fi";
import { MenuItem, Text, TrackedIconButton } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface ApiKeyTableProps {
  keys: ApiKeyInfo[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<ApiKeyInfo>();

export const ApiKeyTable: ComponentWithChildren<ApiKeyTableProps> = ({
  keys,
  isLoading,
  isFetched,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<ApiKeyInfo>();

  const handleEditKey = useCallback(
    (apiKey: string) => {
      const foundKey = keys.find((key) => key.key === apiKey);
      if (foundKey) {
        setActiveKey(foundKey);
        setEditModalOpen(true);
      }
    },
    [keys],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (cell) => <Text>{cell.getValue()}</Text>,
      }),

      columnHelper.accessor("key", {
        header: "Key",
        cell: (cell) => <CopyApiKeyButton apiKey={cell.getValue()} />,
      }),

      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (cell) => {
          const value = cell.getValue();

          if (!value) {
            return;
          }
          const createdDate = format(new Date(value), "MMM dd, yyyy");
          return <Text>{createdDate}</Text>;
        },
      }),

      columnHelper.accessor("key", {
        header: "",
        id: "key-actions",
        cell: (cell) => {
          return (
            <Flex width="100%" justify="flex-end">
              <Menu isLazy>
                <MenuButton
                  as={TrackedIconButton}
                  variant="ghost"
                  icon={<FiMoreVertical />}
                />
                <MenuList>
                  <MenuItem
                    onClick={() => handleEditKey(cell.getValue())}
                    icon={<Icon as={FiEdit2} />}
                  >
                    Edit
                  </MenuItem>
                  <RevokeApiKeyButton apiKey={cell.getValue()} />
                </MenuList>
              </Menu>
            </Flex>
          );
        },
      }),
    ],
    [handleEditKey],
  );

  return (
    <>
      <EditApiKeyModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        apiKey={activeKey}
      />

      <TWTable
        title="api key"
        columns={columns}
        data={keys}
        isLoading={isLoading}
        isFetched={isFetched}
      />
    </>
  );
};
