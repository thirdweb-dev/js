import {
  AdminOnly,
  AdminOrSelfOnly,
} from "@3rdweb-sdk/react/components/roles/admin-only";
import {
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { DelayedDisplay } from "components/delayed-display/delayed-display";
import { constants, utils } from "ethers";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BiPaste } from "react-icons/bi";
import { FiCopy, FiInfo, FiPlus, FiTrash } from "react-icons/fi";
import { Button, FormErrorMessage, Text } from "tw-components";

interface PermissionEditorProps {
  role: string;
  contract: ValidContractInstance;
}

export const PermissionEditor: React.FC<PermissionEditorProps> = ({
  role,
  contract,
}) => {
  const {
    control,
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: role,
  });
  const [address, setAddress] = useState("");

  const members = watch(role) || [];
  const isDisabled = !utils.isAddress(address) || members.includes(address);

  const addAddress = () => {
    if (isDisabled) {
      return;
    }

    append(address);
    setAddress("");
  };

  return (
    <Stack spacing={2}>
      {!fields?.length && (
        <DelayedDisplay delay={100}>
          <Stack
            direction="row"
            bg="orange.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="orange.100"
            align="center"
            padding="10px"
            spacing={3}
          >
            <Icon as={FiInfo} color="orange.400" boxSize={6} />
            <Text color="orange.800">
              {role === "asset"
                ? "No asset contracts are permitted to be listed on this marketplace."
                : "Nobody has this permission for this contract."}
            </Text>
          </Stack>
        </DelayedDisplay>
      )}
      {fields?.map((field, index) => (
        <PermissionAddress
          key={field.id}
          isSubmitting={isSubmitting}
          role={role}
          member={watch(`${role}.${index}`)}
          removeAddress={() => remove(index)}
          contract={contract}
        />
      ))}
      <AdminOnly contract={contract as ValidContractInstance}>
        <FormControl
          isDisabled={isSubmitting}
          isInvalid={address && isDisabled}
        >
          <InputGroup>
            <InputLeftAddon p={0} border="none">
              <Tooltip label="Paste address from clipboard">
                <IconButton
                  borderRadius="sm"
                  borderLeftRadius="md"
                  aria-label="paste address"
                  icon={<BiPaste />}
                  _hover={{ bgColor: "gray.300" }}
                  width="100%"
                  height="100%"
                  onClick={() => {
                    navigator.clipboard
                      .readText()
                      .then((text) => {
                        setAddress(text);
                      })
                      .catch((err) => {
                        console.error("failed to paste from clipboard", err);
                      });
                  }}
                />
              </Tooltip>
            </InputLeftAddon>
            <Input
              variant="filled"
              fontFamily="mono"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={constants.AddressZero}
              px={2}
            />
            <InputRightAddon
              p={0}
              border="none"
              children={
                <Button
                  leftIcon={<Icon as={FiPlus} boxSize={4} />}
                  size="sm"
                  borderLeftRadius="none"
                  borderRightRadius="md"
                  colorScheme="primary"
                  isDisabled={isDisabled}
                  onClick={addAddress}
                  height="100%"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  Add Address
                </Button>
              }
            />
          </InputGroup>
          <FormErrorMessage>
            {members.includes(address)
              ? "Address already has this role"
              : !utils.isAddress(address)
                ? "Not a valid address"
                : ""}
          </FormErrorMessage>
        </FormControl>
      </AdminOnly>
    </Stack>
  );
};

interface PermissionAddressProps {
  role: string;
  member: string;
  removeAddress: () => void;
  isSubmitting: boolean;
  contract: ValidContractInstance;
}

const PermissionAddress: React.FC<PermissionAddressProps> = ({
  member,
  removeAddress,
  isSubmitting,
  contract,
}) => {
  const toast = useToast();

  const { onCopy } = useClipboard(member);
  const handleCopy = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    onCopy();
    toast({
      position: "bottom",
      variant: "solid",
      title: "Address copied.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Flex gap={0} align="center">
      <InputGroup>
        <InputLeftAddon p={0} border="none">
          <Tooltip label="Copy address to clipboard">
            <IconButton
              borderRadius="sm"
              borderLeftRadius="md"
              aria-label="copy address"
              icon={<FiCopy />}
              _hover={{ bgColor: "gray.300" }}
              width="100%"
              height="100%"
              onClick={handleCopy}
            />
          </Tooltip>
        </InputLeftAddon>
        <Input
          variant="filled"
          fontFamily="mono"
          defaultValue={member}
          px={2}
        />
        <AdminOrSelfOnly
          contract={contract as ValidContractInstance}
          self={member}
        >
          <InputRightAddon
            p={0}
            border="none"
            children={
              <Button
                leftIcon={<Icon as={FiTrash} boxSize={3} />}
                size="sm"
                borderLeftRadius="none"
                borderRightRadius="md"
                colorScheme="red"
                isDisabled={isSubmitting}
                onClick={removeAddress}
                height="100%"
                width="100%"
                justifyContent="center"
                alignItems="center"
              >
                Remove
              </Button>
            }
          />
        </AdminOrSelfOnly>
      </InputGroup>
    </Flex>
  );
};
