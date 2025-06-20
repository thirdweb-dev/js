import {
  AdminOnly,
  AdminOrSelfOnly,
} from "@3rdweb-sdk/react/components/roles/admin-only";
import {
  Flex,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import { DelayedDisplay } from "components/delayed-display/delayed-display";
import { useClipboard } from "hooks/useClipboard";
import {
  ClipboardPasteIcon,
  CopyIcon,
  InfoIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { Button, FormErrorMessage, Text } from "tw-components";
import { ToolTipLabel } from "@/components/ui/tooltip";

interface PermissionEditorProps {
  role: string;
  contract: ThirdwebContract;
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
  const isDisabled = !isAddress(address) || members.includes(address);

  const addAddress = () => {
    if (isDisabled) {
      return;
    }

    append(address);
    setAddress("");
  };

  return (
    <div className="flex flex-col gap-2">
      {!fields?.length && (
        <DelayedDisplay delay={100}>
          <div className="flex flex-row items-center gap-3 rounded-md border border-border border-orange-100 bg-orange-50 p-[10px]">
            <InfoIcon className="size-6 text-orange-400" />
            <Text color="orange.800">
              {role === "asset"
                ? "No asset contracts are permitted to be listed on this marketplace."
                : "Nobody has this permission for this contract."}
            </Text>
          </div>
        </DelayedDisplay>
      )}
      {fields?.map((field, index) => (
        <PermissionAddress
          contract={contract}
          isSubmitting={isSubmitting}
          key={field.id}
          member={watch(`${role}.${index}`)}
          removeAddress={() => remove(index)}
          role={role}
        />
      ))}
      <AdminOnly contract={contract}>
        <FormControl
          isDisabled={isSubmitting}
          isInvalid={address && isDisabled}
        >
          <InputGroup>
            <InputLeftAddon border="none" p={0}>
              <ToolTipLabel label="Paste address from clipboard">
                <IconButton
                  aria-label="paste address"
                  borderLeftRadius="md"
                  borderRadius="sm"
                  height="100%"
                  icon={<ClipboardPasteIcon className="size-4" />}
                  onClick={() => {
                    navigator.clipboard
                      .readText()
                      .then((text) => {
                        setAddress(text);
                        return void 0;
                      })
                      .catch((error) => {
                        console.error(error);
                        toast.error("Failed to paste from clipboard");
                      });
                  }}
                  width="100%"
                />
              </ToolTipLabel>
            </InputLeftAddon>
            <Input
              fontFamily="mono"
              onChange={(e) => setAddress(e.target.value)}
              placeholder={ZERO_ADDRESS}
              px={2}
              value={address}
              variant="filled"
            />
            <InputRightAddon border="none" p={0}>
              <Button
                alignItems="center"
                borderLeftRadius="none"
                borderRightRadius="md"
                colorScheme="primary"
                height="100%"
                isDisabled={isDisabled}
                justifyContent="center"
                leftIcon={<PlusIcon className="size-4" />}
                onClick={addAddress}
                size="sm"
                width="100%"
              >
                Add Address
              </Button>
            </InputRightAddon>
          </InputGroup>
          <FormErrorMessage>
            {members.includes(address)
              ? "Address already has this role"
              : !isAddress(address)
                ? "Not a valid address"
                : ""}
          </FormErrorMessage>
        </FormControl>
      </AdminOnly>
    </div>
  );
};

interface PermissionAddressProps {
  role: string;
  member: string;
  removeAddress: () => void;
  isSubmitting: boolean;
  contract: ThirdwebContract;
}

const PermissionAddress: React.FC<PermissionAddressProps> = ({
  member,
  removeAddress,
  isSubmitting,
  contract,
}) => {
  const { onCopy } = useClipboard(member);

  return (
    <Flex align="center" gap={0}>
      <InputGroup>
        <InputLeftAddon border="none" p={0}>
          <ToolTipLabel label="Copy address to clipboard">
            <IconButton
              aria-label="copy address"
              borderLeftRadius="md"
              borderRadius="sm"
              height="100%"
              icon={<CopyIcon className="size-4" />}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCopy();
                toast.info("Address copied.");
              }}
              width="100%"
            />
          </ToolTipLabel>
        </InputLeftAddon>
        <Input
          defaultValue={member}
          fontFamily="mono"
          px={2}
          variant="filled"
        />
        <AdminOrSelfOnly contract={contract} self={member}>
          <InputRightAddon border="none" p={0}>
            <Button
              alignItems="center"
              borderLeftRadius="none"
              borderRightRadius="md"
              colorScheme="red"
              height="100%"
              isDisabled={isSubmitting}
              justifyContent="center"
              leftIcon={<TrashIcon className="size-3" />}
              onClick={removeAddress}
              size="sm"
              width="100%"
            >
              Remove
            </Button>
          </InputRightAddon>
        </AdminOrSelfOnly>
      </InputGroup>
    </Flex>
  );
};
