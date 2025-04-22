import { ToolTipLabel } from "@/components/ui/tooltip";
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
import { type ThirdwebContract, ZERO_ADDRESS, isAddress } from "thirdweb";
import { Button, FormErrorMessage, Text } from "tw-components";

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
          key={field.id}
          isSubmitting={isSubmitting}
          role={role}
          member={watch(`${role}.${index}`)}
          removeAddress={() => remove(index)}
          contract={contract}
        />
      ))}
      <AdminOnly contract={contract}>
        <FormControl
          isDisabled={isSubmitting}
          isInvalid={address && isDisabled}
        >
          <InputGroup>
            <InputLeftAddon p={0} border="none">
              <ToolTipLabel label="Paste address from clipboard">
                <IconButton
                  borderRadius="sm"
                  borderLeftRadius="md"
                  aria-label="paste address"
                  icon={<ClipboardPasteIcon className="size-4" />}
                  width="100%"
                  height="100%"
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
                />
              </ToolTipLabel>
            </InputLeftAddon>
            <Input
              variant="filled"
              fontFamily="mono"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={ZERO_ADDRESS}
              px={2}
            />
            <InputRightAddon p={0} border="none">
              <Button
                leftIcon={<PlusIcon className="size-4" />}
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
    <Flex gap={0} align="center">
      <InputGroup>
        <InputLeftAddon p={0} border="none">
          <ToolTipLabel label="Copy address to clipboard">
            <IconButton
              borderRadius="sm"
              borderLeftRadius="md"
              aria-label="copy address"
              icon={<CopyIcon className="size-4" />}
              width="100%"
              height="100%"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCopy();
                toast.info("Address copied.");
              }}
            />
          </ToolTipLabel>
        </InputLeftAddon>
        <Input
          variant="filled"
          fontFamily="mono"
          defaultValue={member}
          px={2}
        />
        <AdminOrSelfOnly contract={contract} self={member}>
          <InputRightAddon p={0} border="none">
            <Button
              leftIcon={<TrashIcon className="size-3" />}
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
          </InputRightAddon>
        </AdminOrSelfOnly>
      </InputGroup>
    </Flex>
  );
};
