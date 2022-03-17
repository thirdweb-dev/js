import {
  AdminOrSelfOnly,
  ContractWithRolesInstance,
  useIsAdmin,
} from "@3rdweb-sdk/react";
import {
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import { Role } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { isAddress } from "ethers/lib/utils";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FiInfo, FiPlus, FiTrash } from "react-icons/fi";
import { ImCopy, ImPaste } from "react-icons/im";

interface IPermissionEditor {
  role: Role;
  contract: ContractWithRolesInstance;
}

export const PermissionEditor: React.FC<IPermissionEditor> = ({
  role,
  contract,
}) => {
  const isAdmin = useIsAdmin(contract);
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
  const isDisabled = !isAddress(address) || members.includes(address);

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
      )}
      {fields?.map((field, index) => (
        <PermissionAddress
          key={field.id}
          isSubmitting={isSubmitting}
          contract={contract}
          role={role}
          member={watch(`${role}.${index}`)}
          removeAddress={() => remove(index)}
        />
      ))}
      {isAdmin && (
        <FormControl
          isDisabled={isSubmitting}
          isInvalid={address && isDisabled}
        >
          <InputGroup>
            <InputLeftElement>
              <Tooltip label="Paste address from clipboard">
                <IconButton
                  size="sm"
                  borderRadius="md"
                  aria-label="paste address"
                  icon={<ImPaste />}
                  _hover={{ borderColor: "blue.500" }}
                  borderWidth="1px"
                  // bg="gray.200"
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
            </InputLeftElement>
            <Input
              variant="filled"
              fontFamily="mono"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={AddressZero}
            />
            <InputRightElement width="120px">
              <Button
                leftIcon={<Icon as={FiPlus} boxSize={3} />}
                size="sm"
                width="120px"
                colorScheme="blue"
                borderRadius="md"
                isDisabled={isDisabled}
                onClick={addAddress}
                mr="3px"
              >
                Add Address
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {members.includes(address)
              ? "Address already has this role"
              : !isAddress(address)
              ? "Not a valid address"
              : ""}
          </FormErrorMessage>
        </FormControl>
      )}
    </Stack>
  );
};

interface IPermissionAddress {
  contract?: ContractWithRolesInstance;
  role: Role;
  member: string;
  removeAddress: () => void;
  isSubmitting: boolean;
}

const PermissionAddress: React.FC<IPermissionAddress> = ({
  contract,
  member,
  removeAddress,
  isSubmitting,
}) => {
  const toast = useToast();

  const { onCopy } = useClipboard(member);
  const handleCopy = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    onCopy();
    toast({
      title: "Address copied.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Flex gap={0} align="center">
      <Flex
        height="40px"
        flexGrow={1}
        bg="inputBg"
        borderColor="inputBorder"
        borderWidth="1px"
        align="center"
        borderRightRadius="md"
        borderRadius="md"
      >
        <Tooltip label="Copy address to clipboard">
          <IconButton
            m={0.5}
            size="sm"
            borderRadius="md"
            aria-label="copy address"
            icon={<ImCopy />}
            _hover={{ borderColor: "blue.500" }}
            borderWidth="1px"
            onClick={handleCopy}
          />
        </Tooltip>
        <Text flexGrow={1} fontFamily="mono" size="body.lg" pl="4px">
          {member}
        </Text>
        <AdminOrSelfOnly contract={contract} self={member}>
          <Button
            isDisabled={isSubmitting}
            onClick={removeAddress}
            leftIcon={<Icon as={FiTrash} boxSize={3} />}
            colorScheme="red"
            variant="solid"
            size="sm"
            borderRadius="md"
            mr="3px"
          >
            Remove
          </Button>
        </AdminOrSelfOnly>
      </Flex>
    </Flex>
  );
};
