import { Box, Flex, FormControl, Input, SimpleGrid } from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import {
  SellerValueInput,
  usePaymentsSellerByAccountId,
  usePaymentsUpdateSellerByAccountId,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { useTrack } from "hooks/analytics/useTrack";
import { PaymentsSettingsFileUploader } from "./payment-settings-file-uploader";

interface PaymentsSettingsAccountProps {
  accountId: string;
}

export const PaymentsSettingsAccount: React.FC<
  PaymentsSettingsAccountProps
> = ({ accountId }) => {
  const { mutate: updateSellerByAccountId, isLoading } =
    usePaymentsUpdateSellerByAccountId(accountId);
  const { data: sellerData } = usePaymentsSellerByAccountId(accountId);
  const trackEvent = useTrack();

  const values: SellerValueInput = {
    company_logo_url: sellerData?.company_logo_url || "",
    company_name: sellerData?.company_name || "",
    support_email: sellerData?.support_email || "",
    twitter_handle: sellerData?.twitter_handle || "",
    is_sole_proprietor: false,
  };

  const form = useForm<SellerValueInput>({
    defaultValues: values,
    values,
    resetOptions: {
      keepDirty: true,
      keepDirtyValues: true,
    },
  });

  const { onSuccess, onError } = useTxNotifications(
    "Profile saved succesfully.",
    "Failed to save profile",
  );

  return (
    <Card
      p={8}
      as={Flex}
      flexDir="column"
      gap={8}
      maxW={{ base: "full", xl: "70%" }}
    >
      <Flex flexDir="column" gap={2}>
        <Heading>Seller Information</Heading>
        <Text>These fields are shown to your buyers. </Text>
      </Flex>

      <Flex
        as="form"
        gap={4}
        flexDir="column"
        onSubmit={form.handleSubmit((data) => {
          trackEvent({
            category: "payments",
            action: "update-settings",
            label: "attempt",
          });
          updateSellerByAccountId(
            {
              thirdwebAccountId: accountId,
              sellerValue: {
                ...data,
              },
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: "payments",
                  action: "update-settings",
                  label: "success",
                });
                onSuccess();
              },
              onError: (error) => {
                trackEvent({
                  category: "payments",
                  action: "update-settings",
                  label: "error",
                  error,
                });
                onError(error);
              },
            },
          );
        })}
      >
        <Flex flexDir="column" gap={6}>
          <FormControl isInvalid={!!form.formState.errors.company_logo_url}>
            <FormLabel>Company Logo</FormLabel>
            <Box w={28}>
              <PaymentsSettingsFileUploader
                value={form.watch("company_logo_url")}
                onUpdate={(value: string) => {
                  form.setValue("company_logo_url", value);
                }}
              />
            </Box>
          </FormControl>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <FormControl
              isInvalid={!!form.formState.errors.company_name}
              isRequired
            >
              <FormLabel>Company Name</FormLabel>
              <Input
                placeholder="Your Company"
                {...form.register("company_name", { required: true })}
              />
              <FormErrorMessage>
                {form.formState.errors?.company_name?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!form.formState.errors.support_email}
              isRequired
            >
              <FormLabel>Company Email</FormLabel>
              <Input
                placeholder="your@company.com"
                type="email"
                {...form.register("support_email", { required: true })}
              />
              <FormErrorMessage>
                {form.formState.errors?.support_email?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!form.formState.errors.twitter_handle}>
              <FormLabel>X (Twitter) Username</FormLabel>
              <Input
                placeholder="@handle"
                {...form.register("twitter_handle")}
              />
              <FormErrorMessage>
                {form.formState.errors?.twitter_handle?.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>
        </Flex>

        <Flex justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="primary"
            px={12}
            isLoading={form.formState.isSubmitting || isLoading}
          >
            Save
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
