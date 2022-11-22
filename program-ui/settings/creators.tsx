import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Switch,
} from "@chakra-ui/react";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { IoMdRemove } from "@react-icons/all-files/io/IoMdRemove";
import { PublicKey } from "@solana/web3.js";
import { useCreators, useUpdateCreators } from "@thirdweb-dev/react/solana";
import { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";

interface SettingsCreatorsProps {
  program: NFTCollection | NFTDrop;
}

export const SettingsCreators: React.FC<SettingsCreatorsProps> = ({
  program,
}) => {
  const trackEvent = useTrack();
  const query = useCreators(program);
  const mutation = useUpdateCreators(program);

  const { register, control, getFieldState, formState, watch, handleSubmit } =
    useForm<any>();
  const { fields, append, remove, replace } = useFieldArray({
    name: "creators",
    control,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ address: "", share: 100 }, { shouldFocus: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (query.data && !formState.isDirty) {
      replace(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, formState.isDirty]);

  const { onSuccess, onError } = useTxNotifications(
    "Creators updated",
    "Error updating creators",
  );

  const totalPercentage =
    watch("creators")?.reduce(
      (a: any, b: any) => Number(a) + Number(b.share),
      0,
    ) || 0;

  return (
    <Card p={0} position="relative">
      <Flex
        as="form"
        onSubmit={handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-creators",
            label: "attempt",
          });
          mutation.mutateAsync(
            { creators: d.creators, updateAll: d.updateAll },
            {
              onSuccess: () => {
                trackEvent({
                  category: "settings",
                  action: "set-creators",
                  label: "success",
                });
                onSuccess();
              },
              onError: (error) => {
                trackEvent({
                  category: "settings",
                  action: "set-creators",
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
          <Heading size="title.sm">Creators</Heading>
          <Text size="body.md" fontStyle="italic">
            Determine the creators that will receive royalties for this program.
          </Text>
          <Flex gap={4} direction="column">
            {totalPercentage < 100 ? (
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <AlertDescription>
                  Total shares need to add up to 100%. Total shares currently
                  add up to {totalPercentage}%.
                </AlertDescription>
              </Alert>
            ) : totalPercentage > 100 ? (
              <Alert status="warning">
                <AlertIcon />
                <AlertDescription>
                  Total shares cannot go over 100%.
                </AlertDescription>
              </Alert>
            ) : null}

            <Flex direction="column" gap={2}>
              {fields.map((field, index) => {
                return (
                  <Flex
                    key={field.id}
                    gap={2}
                    direction={{ base: "column", md: "row" }}
                  >
                    <FormControl
                      isInvalid={
                        !!getFieldState(`creators.${index}.address`, formState)
                          .error
                      }
                    >
                      <Input
                        variant="filled"
                        placeholder={PublicKey.default.toBase58()}
                        {...register(`creators.${index}.address`)}
                      />
                      <FormErrorMessage>
                        {
                          getFieldState(`creators.${index}.address`, formState)
                            .error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        !!getFieldState(`creators.${index}.share`, formState)
                          .error
                      }
                    >
                      <InputGroup>
                        <Input
                          {...register(`creators.${index}.share`)}
                          type="number"
                        />
                        <InputRightAddon children="%" />
                      </InputGroup>
                      <FormErrorMessage>
                        {
                          getFieldState(`creators.${index}.share`, formState)
                            .error?.message
                        }
                      </FormErrorMessage>
                    </FormControl>
                    <IconButton
                      borderRadius="md"
                      isDisabled={
                        watch("creators").length === 1 || formState.isSubmitting
                      }
                      colorScheme="red"
                      icon={<IoMdRemove />}
                      aria-label="remove row"
                      onClick={() => remove(index)}
                    />
                  </Flex>
                );
              })}
            </Flex>

            {/* then render high level controls */}
            <Flex>
              <Button
                leftIcon={<IoMdAdd />}
                onClick={() => append({ address: "", share: 0 })}
              >
                Add Recipient
              </Button>
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
                Enabling this will update the creators for all NFTs already
                minted on this program. (This may be expensive depending on how
                many NFTs have already been minted.)
              </FormHelperText>
            </FormControl>
          </Flex>
        </Flex>
        <TransactionButton
          ecosystem="solana"
          colorScheme="primary"
          transactionCount={1}
          isDisabled={
            query.isLoading || !formState.isDirty || totalPercentage !== 100
          }
          type="submit"
          isLoading={mutation.isLoading}
          loadingText="Saving..."
          size="md"
          borderRadius="xl"
          borderTopLeftRadius="0"
          borderTopRightRadius="0"
        >
          Update Creators
        </TransactionButton>
      </Flex>
    </Card>
  );
};
