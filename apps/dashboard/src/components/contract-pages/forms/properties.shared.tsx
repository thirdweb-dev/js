import {
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { FileInput } from "components/shared/FileInput";
import { useEffect } from "react";
import {
  type ArrayPath,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
  type WatchObserver,
  useFieldArray,
} from "react-hook-form";
import { FiPlus, FiSlash, FiTrash, FiUpload, FiX } from "react-icons/fi";
import { Button, FormErrorMessage, FormLabel } from "tw-components";

type OptionalPropertiesInput = {
  [key: string]: string | number;
};

interface IPropertyFieldValues extends FieldValues {
  attributes?: OptionalPropertiesInput;
}

interface IPropertiesFormControlProps<
  TFieldValues extends IPropertyFieldValues,
> {
  control: Control<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors;
  setValue: UseFormSetValue<TFieldValues>;
}

export const PropertiesFormControl = <
  TFieldValues extends IPropertyFieldValues,
>({
  control,
  register,
  watch,
  errors,
  setValue,
}: React.PropsWithChildren<IPropertiesFormControlProps<TFieldValues>>) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "attributes" as ArrayPath<TFieldValues>,
  });

  // TODO: do we need this?
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (fields.length === 0) {
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      append({ trait_type: "", value: "" } as any, { shouldFocus: false });
    }
  }, [fields, append]);

  return (
    <Stack spacing={4}>
      <Flex justify="space-between" align="center" direction="row">
        <FormLabel m={0}>Attributes</FormLabel>
        <Button
          rightIcon={<Icon as={FiSlash} />}
          variant="outline"
          colorScheme="red"
          size="xs"
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          onClick={() => replace([{ trait_type: "", value: "" } as any])}
        >
          Reset
        </Button>
      </Flex>
      {fields.map((field, index) => {
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        const keyError = (errors as any)?.attributes?.[index]?.trait_type
          ?.message as string | undefined;
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        const valueError = (errors as any)?.attributes?.[index]?.value
          ?.message as string | undefined;
        const isInvalid = !!(keyError || valueError);

        return (
          <Stack key={field.id} align="center" direction="row">
            <FormControl
              isInvalid={isInvalid}
              as={Stack}
              direction="row"
              align="top"
            >
              <FormControl isInvalid={!!keyError}>
                <Input
                  {...register(
                    `attributes.${index}.trait_type` as Path<TFieldValues>,
                  )}
                  placeholder="trait_type"
                />
                <FormErrorMessage>{keyError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!valueError}>
                {watch(
                  `attributes.${index}.value` as unknown as WatchObserver<TFieldValues>,
                ) instanceof File ? (
                  <InputGroup>
                    <Input
                      isDisabled
                      value={
                        watch(`attributes.${index}.value` as Path<TFieldValues>)
                          .name
                      }
                    />
                    <InputRightElement>
                      <Icon
                        as={FiTrash}
                        cursor="pointer"
                        color="red.300"
                        _hover={{ color: "red.200" }}
                        onClick={() =>
                          setValue(
                            `attributes.${index}.value` as Path<TFieldValues>,
                            "" as PathValue<TFieldValues, Path<TFieldValues>>,
                          )
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                ) : (
                  <InputGroup>
                    <Input
                      {...register(
                        `attributes.${index}.value` as Path<TFieldValues>,
                      )}
                      placeholder="value"
                    />
                    <InputRightElement>
                      <Tooltip label="Upload file" shouldWrapChildren>
                        <FileInput
                          setValue={(file) => {
                            setValue(
                              `attributes.${index}.value` as Path<TFieldValues>,
                              file as PathValue<
                                TFieldValues,
                                Path<TFieldValues>
                              >,
                            );
                          }}
                        >
                          <Icon
                            as={FiUpload}
                            color="gray.600"
                            _hover={{ color: "gray.500" }}
                          />
                        </FileInput>
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>
                )}
                <FormErrorMessage>{valueError}</FormErrorMessage>
              </FormControl>
            </FormControl>
            <IconButton
              onClick={() => remove(index)}
              colorScheme="red"
              variant="ghost"
              aria-label="remove key value pair"
              size="xs"
              icon={<Icon as={FiX} />}
            />
          </Stack>
        );
      })}
      <Stack direction="row">
        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="purple"
          size="sm"
          onClick={() =>
            // biome-ignore lint/suspicious/noExplicitAny: FIXME
            append({ trait_type: undefined, value: undefined } as any)
          }
        >
          Add Row
        </Button>
      </Stack>
    </Stack>
  );
};
