import { Flex, FormControl, Switch } from "@chakra-ui/react";
import {
  useRoyaltySettings,
  useUpdateRoyaltySettings,
} from "@thirdweb-dev/react/solana";
import { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";

interface SettingsRoyaltiesProps {
  program: NFTCollection | NFTDrop;
}

export const SettingsRoyalties: React.FC<SettingsRoyaltiesProps> = ({
  program,
}) => {
  const trackEvent = useTrack();
  const query = useRoyaltySettings(program);
  const mutation = useUpdateRoyaltySettings(program);
  const {
    handleSubmit,
    getFieldState,
    formState,
    reset,
    watch,
    setValue,
    register,
  } = useForm<{ sellerFeeBasisPoints: number; updateAll: boolean }>();
  useEffect(() => {
    if (query.data && !formState.isDirty) {
      reset({ sellerFeeBasisPoints: query.data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, formState.isDirty]);

  const { onSuccess, onError } = useTxNotifications(
    "Royalty settings updated",
    "Error updating royalty settings",
  );

  return (
    <Card p={0} position="relative">
      <Flex
        as="form"
        onSubmit={handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-royalty",
            label: "attempt",
          });
          mutation.mutateAsync(
            {
              sellerFeeBasisPoints: d.sellerFeeBasisPoints,
              updateAll: d.updateAll,
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: "settings",
                  action: "set-royalty",
                  label: "success",
                });
                reset();
                onSuccess();
              },
              onError: (error) => {
                trackEvent({
                  category: "settings",
                  action: "set-royalty",
                  label: "error",
                  error,
                });
                onError(error);
              },
            },
          );
        })}
        direction="column"
      >
        <Flex p={{ base: 6, md: 10 }} as="section" direction="column" gap={4}>
          <Heading size="title.sm">Royalties</Heading>
          <Text size="body.md" fontStyle="italic">
            Determine the percentage creators will receive from secondary sales
            of the assets.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              maxW={{ base: "100%", md: "200px" }}
              isInvalid={
                !!getFieldState("sellerFeeBasisPoints", formState).error
              }
            >
              <FormLabel>Percentage</FormLabel>
              <BasisPointsInput
                variant="filled"
                value={watch("sellerFeeBasisPoints")}
                onChange={(value) =>
                  setValue("sellerFeeBasisPoints", value, {
                    shouldTouch: true,
                  })
                }
              />
              <FormErrorMessage>
                {
                  getFieldState("sellerFeeBasisPoints", formState).error
                    ?.message
                }
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <FormControl display="flex" as={Flex} flexDir="column">
            <Flex gap={2} alignItems="center">
              <Switch
                id="update-all"
                colorScheme="primary"
                {...register("updateAll")}
              />
              <FormLabel htmlFor="update-all" mb="0">
                Apply retroactively
              </FormLabel>
            </Flex>
            <FormHelperText>
              Enabling this will will update the royalties for all NFTs already
              minted on this program. (This may be expensive depending on how
              many NFTs have already been minted.)
            </FormHelperText>
          </FormControl>
        </Flex>
        <TransactionButton
          ecosystem="solana"
          colorScheme="primary"
          transactionCount={1}
          isDisabled={query.isLoading || !formState.isDirty}
          type="submit"
          isLoading={mutation.isLoading}
          loadingText="Saving..."
          size="md"
          borderRadius="xl"
          borderTopLeftRadius="0"
          borderTopRightRadius="0"
        >
          Update Royalty Settings
        </TransactionButton>
      </Flex>
    </Card>
  );
};
