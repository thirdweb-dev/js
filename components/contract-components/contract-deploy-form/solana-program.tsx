import { Flex, FormControl, Input, Textarea } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NFTCollectionMetadataInputSchema,
  NFTDropContractInputSchema,
  TokenMetadataInputSchema,
} from "@thirdweb-dev/sdk/solana";
import { FileInput } from "components/shared/FileInput";
import { SolContractType } from "constants/mappings";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useMemo } from "react";
import {
  FieldPath,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { z } from "zod";

const SOL_DEPLOY_SCHEMAS = {
  "nft-collection": NFTCollectionMetadataInputSchema,
  token: TokenMetadataInputSchema,
  "nft-drop": NFTDropContractInputSchema,
} as const;

function useDeployForm(
  deploySchema: typeof SOL_DEPLOY_SCHEMAS[SolContractType],
) {
  const { handleSubmit: _handleSubmit, ...restForm } = useForm<
    z.infer<typeof deploySchema>
  >({
    resolver: zodResolver(deploySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  function handleSubmit(
    onValid: SubmitHandler<z.infer<typeof deploySchema>>,
    onInvalid?: SubmitErrorHandler<z.infer<typeof deploySchema>>,
  ) {
    return _handleSubmit((d) => {
      onValid(stripNullishKeys(d));
    }, onInvalid);
  }

  return { ...restForm, handleSubmit };
}

function stripNullishKeys<T extends object>(obj: T) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value || value === 0) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as T);
}

type BuiltinSolanaDeployFormProps<TContractType extends SolContractType> = {
  formId: string;
  contractType: TContractType;
  onSubmitForm: (
    data: z.output<typeof SOL_DEPLOY_SCHEMAS[TContractType]>,
  ) => Promise<void> | void;
};
const BuiltinSolanaDeployForm = <TContractType extends SolContractType>({
  formId,
  contractType,
  onSubmitForm,
}: BuiltinSolanaDeployFormProps<TContractType>) => {
  const deploySchema = SOL_DEPLOY_SCHEMAS[contractType];

  const form = useDeployForm(deploySchema);

  const { handleSubmit, getFieldState, formState, watch, register, setValue } =
    form;
  const hasSymbol = useMemo(
    () => "symbol" in deploySchema.shape,
    [deploySchema],
  );

  const hasInitialSupply = useMemo(
    () => "initialSupply" in deploySchema.shape,
    [deploySchema],
  );

  const hasTotalSupply = useMemo(
    () => "totalSupply" in deploySchema.shape,
    [deploySchema],
  );

  function isRequired<
    TFieldName extends FieldPath<z.infer<typeof deploySchema>> | string,
  >(name: TFieldName): boolean {
    return name in deploySchema.shape
      ? !deploySchema.shape[
          name as keyof typeof deploySchema.shape
        ].isOptional()
      : true;
  }

  return (
    <Flex
      id={formId}
      flexGrow={1}
      minH="full"
      gap={4}
      direction="column"
      as="form"
      onSubmit={handleSubmit(
        (data) => onSubmitForm(data),
        (errors) => {
          console.error(errors);
        },
      )}
    >
      <Flex direction="column">
        <Heading size="subtitle.md">Contract Metadata</Heading>
        <Text size="body.md" fontStyle="italic">
          Settings to organize and distinguish between your different contracts.
        </Text>
      </Flex>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <Flex
          flexShrink={0}
          flexGrow={1}
          minW="100px"
          maxW={{ base: "100%", md: "160px" }}
        >
          <FormControl
            isRequired={isRequired("image")}
            display="flex"
            flexDirection="column"
            isInvalid={!!getFieldState("image", formState).error}
          >
            <FormLabel>Image</FormLabel>
            <FileInput
              accept={{ "image/*": [] }}
              value={useImageFileOrUrl(watch("image"))}
              setValue={(file) =>
                setValue("image", file, { shouldTouch: true })
              }
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              transition="all 200ms ease"
              w="50"
            />
            <FormErrorMessage>
              {getFieldState("image", formState).error?.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>

        <Flex direction="column" gap={4} flexGrow={1} justify="space-between">
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isRequired={isRequired("name")}
              isInvalid={!!getFieldState("name", formState).error}
            >
              <FormLabel>Name</FormLabel>

              <Input autoFocus variant="filled" {...register("name")} />
              <FormErrorMessage>
                {getFieldState("name", formState).error?.message}
              </FormErrorMessage>
            </FormControl>
            {hasSymbol && (
              <FormControl
                maxW={{ base: "100%", md: "200px" }}
                isRequired={isRequired("symbol")}
                isInvalid={!!getFieldState("symbol", formState).error}
              >
                <FormLabel>Symbol</FormLabel>

                <Input variant="filled" {...register("symbol")} />
                <FormErrorMessage>
                  {getFieldState("symbol", formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          </Flex>

          <FormControl
            isRequired={isRequired("description")}
            isInvalid={!!getFieldState("description", formState).error}
          >
            <FormLabel>Description</FormLabel>

            <Textarea variant="filled" {...register("description")} />
            <FormErrorMessage>
              {getFieldState("description", formState).error?.message}
            </FormErrorMessage>
          </FormControl>

          {hasInitialSupply && (
            <FormControl
              isRequired={isRequired("initialSupply")}
              isInvalid={!!getFieldState("initialSupply", formState).error}
            >
              <FormLabel>Initial Supply</FormLabel>

              <Input variant="filled" {...register("initialSupply")} />
              <FormErrorMessage>
                {getFieldState("initialSupply", formState).error?.message}
              </FormErrorMessage>
              <FormHelperText>
                This is the initial amount of tokens that will be minted at
                creation time.
                <br />
                You can always mint more tokens later from the dashboard.
              </FormHelperText>
            </FormControl>
          )}

          {hasTotalSupply && (
            <FormControl
              isRequired={isRequired("totalSupply")}
              isInvalid={!!getFieldState("totalSupply", formState).error}
            >
              <FormLabel>Total Supply</FormLabel>
              <Input variant="filled" {...register("totalSupply")} />
              <FormErrorMessage>
                {getFieldState("totalSupply", formState).error?.message}
              </FormErrorMessage>
              <FormHelperText>
                ⚠️ This is the maximum amount of NFTs that will be available on
                your drop.
                <br />
                ⚠️ All NFTs will need to be uploaded before any can be claimed.
                <br />
                ⚠️ This setting cannot be changed later.
                <br />
                ⚠️ The larger the number, the more expensive the transaction
                will be to be able to cover storage rent costs.
              </FormHelperText>
            </FormControl>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BuiltinSolanaDeployForm;
