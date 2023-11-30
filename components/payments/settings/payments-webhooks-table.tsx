import {
  PaymentsWebhooksType,
  isValidWebhookUrl,
} from "@3rdweb-sdk/react/hooks/usePayments";
import {
  ButtonGroup,
  FormControl,
  Icon,
  IconButton,
  Input,
  Modal,
  Tr,
  Td,
  Th,
  Thead,
  Tbody,
  Table,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  useDisclosure,
  Stack,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { forwardRef, useRef, useState } from "react";
import pluralize from "pluralize";
import { format } from "date-fns";
import { Button, Text, TableContainer, FormLabel } from "tw-components";
import { BiPencil } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { FaXmark } from "react-icons/fa6";

export interface PaymentsWebhooksTableProps {
  webhooks: PaymentsWebhooksType[];
  onCreate: (url: string) => void;
  onUpdate: (webhook: PaymentsWebhooksType, newUrl: string) => void;
  onDelete: (webhook: PaymentsWebhooksType) => void;
  isLoading: boolean;
}

interface UrlInputFieldProps {
  webhookUrl: string;
  onChange: (value: string) => void;
}

const UrlInputField = forwardRef<HTMLInputElement, UrlInputFieldProps>(
  ({ webhookUrl, onChange }, ref) => {
    const isValid = isValidWebhookUrl(webhookUrl);
    return (
      <FormControl isInvalid={!isValid && !!webhookUrl}>
        <Input
          ref={ref}
          type="url"
          placeholder="Webhook URL"
          value={webhookUrl}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      </FormControl>
    );
  },
);

UrlInputField.displayName = "UrlInputField";

interface EditTableRowProps {
  webhook: PaymentsWebhooksType;
  onEdit: (webhook: PaymentsWebhooksType, newUrl: string) => void;
  onDelete: (webhook: PaymentsWebhooksType) => void;
}

const EditTableRow = ({ webhook, onEdit, onDelete }: EditTableRowProps) => {
  const [editUrl, setEditUrl] = useState(webhook.url ?? "");
  const [isEdit, setIsEdit] = useState(false);

  const editWebhookRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setIsEdit(true);
    setEditUrl(webhook.url);
    if (editWebhookRef.current) {
      editWebhookRef.current.focus();
      editWebhookRef.current.select();
    }
  };

  const acceptEdit = () => {
    onEdit(webhook, editUrl);
    setIsEdit(false);
  };

  const rejectEdit = () => {
    setIsEdit(false);
  };

  const _onDelete = () => {
    onDelete(webhook);
  };

  return (
    <Tr borderBottomWidth={1} _last={{ borderBottomWidth: 0 }}>
      <Td borderBottomWidth="inherit" borderBottomColor="accent.100">
        {isEdit ? (
          <UrlInputField
            webhookUrl={editUrl}
            onChange={setEditUrl}
            ref={editWebhookRef}
          />
        ) : (
          <Text>{webhook.url}</Text>
        )}
      </Td>
      <Td borderBottomWidth="inherit" borderBottomColor="accent.100">
        {isEdit ? (
          <ButtonGroup variant="ghost" gap={2}>
            <IconButton
              onClick={acceptEdit}
              variant="outline"
              icon={<Icon as={FaCheck} boxSize={4} />}
              aria-label="Accept"
            />
            <IconButton
              onClick={rejectEdit}
              variant="outline"
              icon={<Icon as={FaXmark} boxSize={4} />}
              aria-label="Cancel"
            />
          </ButtonGroup>
        ) : (
          <ButtonGroup variant="ghost" gap={2}>
            <IconButton
              onClick={startEdit}
              variant="outline"
              icon={<Icon as={BiPencil} boxSize={4} />}
              aria-label="Edit"
            />
            <IconButton
              onClick={_onDelete}
              variant="outline"
              icon={<Icon as={FiTrash2} boxSize={4} />}
              aria-label="Remove"
            />
          </ButtonGroup>
        )}
      </Td>
    </Tr>
  );
};

interface CreateTableRowProps {
  onCreate: (webhookUrl: string) => void;
}

const CreateTableRow = ({ onCreate }: CreateTableRowProps) => {
  const [createUrl, setCreateUrl] = useState("");
  const createWebhookRef = useRef<HTMLInputElement>(null);

  const _onCreate = () => {
    onCreate(createUrl);
    setCreateUrl("");
  };

  return (
    <Tr borderBottomWidth={1} _last={{ borderBottomWidth: 0 }}>
      <Td borderBottomWidth="inherit" borderBottomColor="accent.100">
        <UrlInputField
          webhookUrl={createUrl}
          onChange={setCreateUrl}
          ref={createWebhookRef}
        />
      </Td>
      <Td borderBottomWidth="inherit" borderBottomColor="accent.100">
        <Button size="sm" leftIcon={<IoMdAdd />} onClick={_onCreate}>
          Create Webhook
        </Button>
      </Td>
    </Tr>
  );
};

export const PaymentsWebhooksTable: React.FC<PaymentsWebhooksTableProps> = ({
  webhooks,
  onUpdate,
  onDelete,
  onCreate,
  isLoading,
}) => {
  const [webhookToRevoke, setWebhookToRevoke] =
    useState<PaymentsWebhooksType>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const _onDelete = (webhook: PaymentsWebhooksType) => {
    setWebhookToRevoke(webhook);
    onOpen();
  };

  const _onConfirmDelete = () => {
    onClose();
    if (webhookToRevoke) {
      onDelete(webhookToRevoke);
    }
  };

  const canAddNewWebhook = webhooks.length < 3;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete webhook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {webhookToRevoke && (
              <Stack gap={4}>
                <Text>Are you sure you want to delete this webook?</Text>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Text>
                    {webhookToRevoke?.isProduction ? "Production" : "Testnet"}
                  </Text>
                </FormControl>
                <FormControl>
                  <FormLabel>URL</FormLabel>
                  <Text>{webhookToRevoke?.url}</Text>
                </FormControl>
                <FormControl>
                  <FormLabel>Created at</FormLabel>
                  <Text>
                    {format(
                      new Date(webhookToRevoke?.createdAt ?? ""),
                      "PP pp z",
                    )}
                  </Text>
                </FormControl>
              </Stack>
            )}
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="red" onClick={_onConfirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th border="none">
                <Flex align="center" gap={2}>
                  <Text as="label" size="label.sm" color="faded">
                    Url
                  </Text>
                </Flex>
              </Th>
              <Th border="none">
                <Flex align="center" gap={2}>
                  <Text as="label" size="label.sm" color="faded">
                    Actions
                  </Text>
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {webhooks.map((webhook, index) => {
              return (
                <EditTableRow
                  key={index}
                  webhook={webhook}
                  onEdit={onUpdate}
                  onDelete={_onDelete}
                />
              );
            })}
            {canAddNewWebhook ? <CreateTableRow onCreate={onCreate} /> : null}
          </Tbody>
        </Table>
        {isLoading && (
          <Center>
            <Flex py={4} direction="row" gap={4} align="center">
              <Spinner size="sm" />
              <Text>Loading {pluralize("Webhooks Table", 0, false)}</Text>
            </Flex>
          </Center>
        )}
      </TableContainer>
    </>
  );
};
