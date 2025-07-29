import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
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
  useFieldArray,
  type WatchObserver,
} from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  client: ThirdwebClient;
}

export function PropertiesFormControl<
  TFieldValues extends IPropertyFieldValues,
>({
  control,
  watch,
  errors,
  setValue,
}: React.PropsWithChildren<IPropertiesFormControlProps<TFieldValues>>) {
  const { fields, append, remove } = useFieldArray({
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
    <div className="flex flex-col gap-4">
      <FormLabel>Attributes</FormLabel>
      {fields.map((field, index) => {
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        const keyError = (errors as any)?.attributes?.[index]?.trait_type
          ?.message as string | undefined;
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        const valueError = (errors as any)?.attributes?.[index]?.value
          ?.message as string | undefined;
        const _isInvalid = !!(keyError || valueError);

        return (
          <div className="flex flex-row items-center gap-2" key={field.id}>
            <div className="flex flex-row items-start gap-3 flex-1">
              <FormField
                control={control}
                name={`attributes.${index}.trait_type` as Path<TFieldValues>}
                render={({ field: traitField }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...traitField}
                        placeholder="trait_type"
                        className={cn(
                          "bg-card",
                          keyError && "border-destructive",
                        )}
                      />
                    </FormControl>
                    {keyError && <FormMessage>{keyError}</FormMessage>}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`attributes.${index}.value` as Path<TFieldValues>}
                render={({ field: valueField }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      {watch(
                        `attributes.${index}.value` as unknown as WatchObserver<TFieldValues>,
                      ) instanceof File ? (
                        <div className="relative">
                          <Input
                            disabled
                            value={
                              watch(
                                `attributes.${index}.value` as Path<TFieldValues>,
                              ).name
                            }
                            className="pr-10 bg-card"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() =>
                              setValue(
                                `attributes.${index}.value` as Path<TFieldValues>,
                                "" as PathValue<
                                  TFieldValues,
                                  Path<TFieldValues>
                                >,
                              )
                            }
                          >
                            <TrashIcon className="size-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Input
                            {...valueField}
                            placeholder="value"
                            className={`pr-10 bg-card ${valueError ? "border-destructive" : ""}`}
                          />
                        </div>
                      )}
                    </FormControl>
                    {valueError && <FormMessage>{valueError}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full p-0 size-10 bg-card"
              onClick={() => remove(index)}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        );
      })}
      <div className="flex flex-row gap-2">
        <Button
          className="rounded-full"
          onClick={() =>
            // biome-ignore lint/suspicious/noExplicitAny: FIXME
            append({ trait_type: undefined, value: undefined } as any)
          }
          size="sm"
        >
          <PlusIcon className="size-4 mr-2" />
          Add Row
        </Button>
      </div>
    </div>
  );
}
