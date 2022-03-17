import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect } from "react";
import {
  DefaultValues,
  FieldPath,
  FormProvider,
  useForm,
} from "react-hook-form";
import type { UseQueryResult } from "react-query";
import type { AnyZodObject, ZodSchema, z } from "zod";

interface FormProps<TSchema extends ZodSchema<any, any>> {
  schema: TSchema;
  onSubmit: (data: z.output<TSchema>) => void | Promise<void>;
  initialValueQuery?: UseQueryResult<DefaultValues<z.input<TSchema>>>;
}

export const TWForm = <TSchema extends AnyZodObject>(
  props: React.PropsWithChildren<FormProps<TSchema>>,
) => {
  const isRequired = useCallback(
    <TFieldName extends FieldPath<z.infer<TSchema>> | string>(
      name: TFieldName,
    ) => {
      return name in props.schema.shape
        ? !props.schema.shape[name as keyof TSchema["shape"]].isOptional()
        : true;
    },
    [props.schema],
  );

  const methods = useForm<z.input<TSchema>>({
    resolver: zodResolver(props.schema),
    defaultValues: props.initialValueQuery?.data,
    context: {
      // we're abusing this here, but it's a nice way to get the schema
      isRequired,
    },
  });

  useEffect(() => {
    if (props.initialValueQuery?.isSuccess && !methods.formState.isDirty) {
      methods.reset(props.initialValueQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialValueQuery?.data, props.initialValueQuery?.isSuccess]);

  return (
    <FormProvider {...methods}>
      <form
        onReset={() => methods.reset(props.initialValueQuery?.data)}
        onSubmit={methods.handleSubmit(props.onSubmit)}
      >
        {props.children}
      </form>
    </FormProvider>
  );
};
