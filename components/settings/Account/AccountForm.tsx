import { useForm } from "react-hook-form";
import {
  AccountValidationOptionalSchema,
  AccountValidationSchema,
  accountValidationOptionalSchema,
  accountValidationSchema,
} from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTxNotifications } from "hooks/useTxNotifications";
import {
  FormControl,
  Input,
  Flex,
  VStack,
  HStack,
  useColorModeValue,
  Switch,
} from "@chakra-ui/react";
import {
  Button,
  ButtonProps,
  FormLabel,
  FormErrorMessage,
  Heading,
  Text,
} from "tw-components";
import { Account, useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useTrack } from "hooks/analytics/useTrack";
import { ManageBillingButton } from "components/settings/Account/ManageBillingButton";
import { useState } from "react";

interface AccountFormProps {
  account: Account;
  horizontal?: boolean;
  previewEnabled?: boolean;
  showBillingButton?: boolean;
  showSubscription?: boolean;
  buttonProps?: ButtonProps;
  buttonText?: string;
  padded?: boolean;
  optional?: boolean;
  trackingCategory?: string;
  disableUnchanged?: boolean;
  onSave?: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  account,
  onSave,
  buttonProps,
  buttonText = "Save",
  horizontal = false,
  previewEnabled = false,
  showBillingButton = false,
  showSubscription = false,
  disableUnchanged = false,
  padded = true,
  optional = false,
}) => {
  const [isSubscribing, setIsSubscribing] = useState(
    showSubscription && !!account.email?.length,
  );
  const trackEvent = useTrack();
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  const form = useForm<
    AccountValidationSchema | AccountValidationOptionalSchema
  >({
    resolver: zodResolver(
      optional ? accountValidationOptionalSchema : accountValidationSchema,
    ),
    values: {
      name: account.name || "",
      email: account.email || "",
    },
  });

  const updateMutation = useUpdateAccount();

  const { onSuccess, onError } = useTxNotifications(
    "Billing account saved.",
    "Failed to save your billing account.",
  );

  const handleSubmit = form.handleSubmit((values) => {
    if (optional && onSave) {
      onSave();
    }

    const formData = {
      ...values,
      ...(showSubscription
        ? {
            subscribeToUpdates: isSubscribing,
          }
        : {}),
    };

    trackEvent({
      category: "account",
      action: "update",
      label: "attempt",
      data: formData,
    });

    updateMutation.mutate(formData, {
      onSuccess: (data) => {
        if (!optional) {
          onSuccess();

          // already called
          if (!optional && onSave) {
            onSave();
          }
        }

        trackEvent({
          category: "account",
          action: "update",
          label: "success",
          data,
        });
      },
      onError: (error) => {
        // don't show errors when form is optional
        if (!optional) {
          onError(error);
        }

        trackEvent({
          category: "account",
          action: "update",
          label: "error",
          error,
        });
      },
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <VStack
        alignItems="flex-start"
        w="full"
        gap={horizontal ? 6 : 8}
        maxW={horizontal ? "auto" : "lg"}
        borderRadius="xl"
        borderColor="borderColor"
        borderWidth={padded ? 1 : 0}
        bg={bg}
        p={padded ? 6 : 0}
      >
        <Flex
          gap={horizontal ? 4 : 8}
          flexDir={horizontal ? "row" : "column"}
          w="full"
        >
          <FormControl
            isRequired={!previewEnabled && !optional}
            isInvalid={!!form.getFieldState("name", form.formState).error}
          >
            <FormLabel>
              Name {optional && <Text as="span">(optional)</Text>}
            </FormLabel>

            {previewEnabled ? (
              <Flex
                borderRadius="md"
                borderColor="borderColor"
                borderWidth={1}
                h={10}
                px={3}
                alignItems="center"
              >
                <Heading size="subtitle.sm">{form.getValues("name")}</Heading>
              </Flex>
            ) : (
              <Input
                placeholder="ACME Inc."
                type="text"
                {...form.register("name")}
              />
            )}

            {form.getFieldState("name", form.formState).error && (
              <FormErrorMessage size="body.sm">
                {form.getFieldState("name", form.formState).error?.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            isRequired={!previewEnabled && !optional}
            isInvalid={!!form.getFieldState("email", form.formState).error}
          >
            <FormLabel>
              Billing email {optional && <Text as="span">(optional)</Text>}
            </FormLabel>

            {previewEnabled ? (
              <Flex
                borderRadius="md"
                borderColor="borderColor"
                borderWidth={1}
                h={10}
                px={3}
                alignItems="center"
              >
                <Heading size="subtitle.sm">{form.getValues("email")}</Heading>
              </Flex>
            ) : (
              <Input
                placeholder="billing@acme.co"
                type="email"
                {...form.register("email")}
              />
            )}

            {form.getFieldState("email", form.formState).error && (
              <FormErrorMessage size="body.sm">
                {form.getFieldState("email", form.formState).error?.message}
              </FormErrorMessage>
            )}
          </FormControl>

          {showSubscription && (
            <HStack gap={2} justifyContent="center">
              <Text>Subscribe to new features and key product updates</Text>
              <Switch
                isDisabled={
                  !form.getValues("email").length ||
                  !!form.getFieldState("email", form.formState).error
                }
                isChecked={isSubscribing}
                onChange={(e) => setIsSubscribing(e.target.checked)}
              />
            </HStack>
          )}
        </Flex>

        <HStack
          justifyContent={showBillingButton ? "space-between" : "flex-end"}
          w="full"
        >
          {showBillingButton && <ManageBillingButton account={account} />}

          {!previewEnabled && (
            <Button
              {...buttonProps}
              type="button"
              onClick={handleSubmit}
              colorScheme="blue"
              isDisabled={
                updateMutation.isLoading ||
                (disableUnchanged && !form.formState.isDirty)
              }
              isLoading={updateMutation.isLoading}
            >
              {buttonText}
            </Button>
          )}
        </HStack>
      </VStack>
    </form>
  );
};
