"use client";

import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowDownLeftIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CircleAlertIcon,
  CopyIcon,
  InfoIcon,
  PlayIcon,
} from "lucide-react";
import Link from "next/link";
import type { OpenAPIV3 } from "openapi-types";
import { useEffect, useMemo, useState } from "react";
import {
  type ControllerRenderProps,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { useTrack } from "../../../../../../hooks/analytics/useTrack";
import { getVercelEnv } from "../../../../../../lib/vercel-utils";
import type { BlueprintParameter, BlueprintPathMetadata } from "../utils";

const trackingCategory = "insightBlueprint";

export function BlueprintPlayground(props: {
  metadata: BlueprintPathMetadata;
  backLink: string;
  clientId: string;
  path: string;
  isInsightEnabled: boolean;
  projectSettingsLink: string;
  supportedChainIds: number[];
  authToken: string;
}) {
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const requestMutation = useMutation({
    mutationFn: async (url: string) => {
      const controller = new AbortController();
      setAbortController(controller);
      const start = performance.now();
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${props.authToken}`,
          },
        });
        return {
          status: res.status,
          data: await res.text(),
          time: performance.now() - start,
        };
      } catch (e) {
        const time = performance.now() - start;
        if (e instanceof Error) {
          return {
            data: e.message,
            time: time,
          };
        }
        return {
          data: "Failed to fetch",
          time: time,
        };
      }
    },
  });

  const thirdwebDomain =
    getVercelEnv() !== "production" ? "thirdweb-dev" : "thirdweb";

  return (
    <BlueprintPlaygroundUI
      backLink={props.backLink}
      clientId={props.clientId}
      metadata={props.metadata}
      isPending={requestMutation.isPending}
      onRun={(url) => {
        requestMutation.mutate(url);
      }}
      response={
        abortController?.signal.aborted ? undefined : requestMutation.data
      }
      abortRequest={() => {
        if (abortController) {
          // just abort it - don't set a new controller
          abortController.abort();
        }
      }}
      domain={`https://insight.${thirdwebDomain}.com`}
      path={props.path}
      isInsightEnabled={props.isInsightEnabled}
      projectSettingsLink={props.projectSettingsLink}
      supportedChainIds={props.supportedChainIds}
    />
  );
}

function modifyParametersForPlayground(_parameters: BlueprintParameter[]) {
  const parameters = [..._parameters];

  // make chain query param required - its not required in open api spec - because it either has to be set in subdomain or as a query param
  const chainIdParameter = parameters.find((p) => p.name === "chain");
  if (chainIdParameter) {
    chainIdParameter.required = true;
  }

  // remove the client id parameter if it is present - we will always replace the parameter with project's client id
  const clientIdParameterIndex = parameters.findIndex(
    (p) => p.name === "clientId",
  );
  if (clientIdParameterIndex !== -1) {
    parameters.splice(clientIdParameterIndex, 1);
  }

  return parameters;
}

export function BlueprintPlaygroundUI(props: {
  backLink: string;
  isPending: boolean;
  onRun: (url: string) => void;
  response:
    | {
        time: number;
        data: undefined | string;
        status?: number;
      }
    | undefined;
  clientId: string;
  abortRequest: () => void;
  domain: string;
  path: string;
  metadata: BlueprintPathMetadata;
  isInsightEnabled: boolean;
  projectSettingsLink: string;
  supportedChainIds: number[];
}) {
  const trackEvent = useTrack();
  const parameters = useMemo(() => {
    const filteredParams = props.metadata.parameters?.filter(
      isOpenAPIV3ParameterObject,
    );
    return modifyParametersForPlayground(filteredParams || []);
  }, [props.metadata.parameters]);

  const formSchema = useMemo(() => {
    return createParametersFormSchema(parameters);
  }, [parameters]);

  const defaultValues = useMemo(() => {
    const values: Record<string, string | number> = {};
    for (const param of parameters) {
      if (param.schema && "type" in param.schema && param.schema.default) {
        values[param.name] = param.schema.default;
      } else {
        values[param.name] = "";
      }
    }
    return values;
  }, [parameters]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const url = createBlueprintUrl({
      parameters: parameters,
      values: values,
      clientId: props.clientId,
      domain: props.domain,
      path: props.path,
      intent: "run",
    });

    trackEvent({
      category: trackingCategory,
      action: "click",
      label: "run",
      url: url,
    });
    props.onRun(url);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex grow flex-col">
          <BlueprintMetaHeader
            title={props.metadata.summary || "Blueprint Playground"}
            description={props.metadata.description}
            backLink={props.backLink}
          />

          <div className="container flex grow flex-col pt-8 pb-20">
            {!props.isInsightEnabled && (
              <Alert variant="destructive" className="mb-8">
                <CircleAlertIcon className="size-5" />
                <AlertTitle>
                  Insight service is disabled for this project
                </AlertTitle>
                <AlertDescription>
                  You can enable Insight service in{" "}
                  <Link
                    href={props.projectSettingsLink}
                    className="underline hover:text-foreground"
                  >
                    {" "}
                    Project Settings{" "}
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex grow flex-col overflow-hidden rounded-xl border bg-muted/50">
              <PlaygroundHeader
                domain={props.domain}
                parameters={parameters}
                path={props.path}
                isPending={props.isPending}
                getFormValues={() => form.getValues()}
                clientId={props.clientId}
              />
              <div className="grid grow grid-cols-1 lg:grid-cols-2">
                <div className="flex max-h-[500px] grow flex-col max-sm:border-b lg:max-h-[740px] lg:border-r">
                  <RequestConfigSection
                    domain={props.domain}
                    parameters={parameters}
                    path={props.path}
                    form={form}
                    supportedChainIds={props.supportedChainIds}
                  />
                </div>

                <div className="flex h-[500px] grow flex-col lg:h-[740px]">
                  <ResponseSection
                    isPending={props.isPending}
                    response={props.response}
                    abortRequest={props.abortRequest}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

function BlueprintMetaHeader(props: {
  title: string;
  description: string | undefined;
  backLink: string;
}) {
  return (
    <div className="border-border border-b py-10">
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            asChild
            variant="outline"
            className="mb-3 h-auto w-auto translate-y-[3px] rounded-lg p-2.5"
            aria-label="Go Back"
          >
            <Link href={props.backLink}>
              <ArrowLeftIcon className="size-4 text-muted-foreground" />
            </Link>
          </Button>

          <div>
            <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
              {props.title}
            </h1>
            {props.description && (
              <p className="mt-1 text-muted-foreground text-sm">
                {props.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaygroundHeader(props: {
  parameters: BlueprintParameter[];
  isPending: boolean;
  getFormValues: () => Record<string, string>;
  clientId: string;
  domain: string;
  path: string;
}) {
  const trackEvent = useTrack();

  const [hasCopied, setHasCopied] = useState(false);
  return (
    <div className="border-b px-4 py-4 lg:flex lg:justify-center lg:py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 overflow-hidden rounded-xl border bg-muted p-2 lg:justify-center">
          {/* copy url */}
          <Button
            variant="ghost"
            className="h-auto w-auto p-1 hover:bg-muted-foreground/10"
            onClick={() => {
              setHasCopied(true);
              const url = createBlueprintUrl({
                clientId: props.clientId,
                parameters: props.parameters,
                domain: props.domain,
                path: props.path,
                values: props.getFormValues(),
                intent: "copy",
              });

              trackEvent({
                category: trackingCategory,
                action: "click",
                label: "copy-url",
                url: url,
              });

              setTimeout(() => {
                setHasCopied(false);
              }, 500);
              navigator.clipboard.writeText(url);
            }}
          >
            {hasCopied ? (
              <CheckIcon className="size-4 text-green-500" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>

          {/* vertical line */}
          <div className="h-6 w-[1px] bg-border" />

          {/* domain + path */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <div className="rounded-xl bg-muted-foreground/10 px-2.5 py-1 font-mono text-xs lg:text-sm">
              <span className="hidden lg:inline">{props.domain}</span>
              <span className="lg:hidden">...</span>
            </div>
            <div className="truncate font-mono text-xs lg:text-sm">
              {props.path}
            </div>
          </div>

          {/* Run */}
          <Button
            className="ml-2 hidden h-auto w-auto gap-1.5 p-1 px-2 lg:flex"
            disabled={props.isPending}
            type="submit"
          >
            {props.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <PlayIcon className="size-4" />
            )}
            Run
          </Button>
        </div>

        <Button
          size="sm"
          className="gap-2 rounded-lg lg:hidden"
          type="submit"
          disabled={props.isPending}
        >
          {props.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
          Run
        </Button>
      </div>
    </div>
  );
}

function RequestConfigSection(props: {
  parameters: BlueprintParameter[];
  form: ParametersForm;
  domain: string;
  path: string;
  supportedChainIds: number[];
}) {
  const { pathVariables, queryParams, filterQueryParams } = useMemo(() => {
    const pathVariables: OpenAPIV3.ParameterObject[] = [];
    const queryParams: OpenAPIV3.ParameterObject[] = [];
    const filterQueryParams: OpenAPIV3.ParameterObject[] = [];

    for (const param of props.parameters) {
      if (param.in === "path") {
        pathVariables.push(param);
      }

      if (param.in === "query") {
        if (param.name.startsWith("filter_")) {
          filterQueryParams.push(param);
        } else {
          queryParams.push(param);
        }
      }
    }

    return {
      pathVariables,
      queryParams,
      filterQueryParams,
    };
  }, [props.parameters]);

  const showError =
    !props.form.formState.isValid &&
    props.form.formState.isDirty &&
    props.form.formState.isSubmitted;

  return (
    <div className="flex grow flex-col overflow-hidden">
      <div className="flex min-h-[60px] items-center justify-between gap-2 border-b p-4 text-sm">
        <div className="flex items-center gap-2">
          <ArrowUpRightIcon className="size-5" />
          Request
        </div>
        {showError && <Badge variant="destructive">Invalid Request</Badge>}
      </div>

      <ScrollShadow className="flex-1" scrollableClassName="max-h-full">
        {pathVariables.length > 0 && (
          <ParameterSection
            parameters={pathVariables}
            title="Path Variables"
            form={props.form}
            domain={props.domain}
            path={props.path}
            supportedChainIds={props.supportedChainIds}
          />
        )}

        {queryParams.length > 0 && (
          <ParameterSection
            className="border-t"
            parameters={queryParams}
            title="Query Parameters"
            form={props.form}
            domain={props.domain}
            path={props.path}
            supportedChainIds={props.supportedChainIds}
          />
        )}

        {filterQueryParams.length > 0 && (
          <ParameterSection
            className="border-t"
            parameters={filterQueryParams}
            title="Filter Query Parameters"
            form={props.form}
            domain={props.domain}
            path={props.path}
            supportedChainIds={props.supportedChainIds}
          />
        )}
      </ScrollShadow>
    </div>
  );
}

type ParametersForm = UseFormReturn<{
  [x: string]: string | number;
}>;

function ParameterSection(props: {
  parameters: BlueprintParameter[];
  title: string;
  form: ParametersForm;
  domain: string;
  path: string;
  supportedChainIds: number[];
  className?: string;
}) {
  const url = `${props.domain}${props.path}`;
  return (
    <div className={cn("p-4 py-6", props.className)}>
      <h3 className="mb-3 font-medium text-sm"> {props.title} </h3>
      <div className="overflow-hidden rounded-lg border">
        {props.parameters.map((param, i) => {
          const description =
            param.schema && "type" in param.schema
              ? param.schema.description
              : undefined;

          const example =
            param.schema && "type" in param.schema
              ? param.schema.example
              : undefined;
          const exampleToShow =
            typeof example === "string" || typeof example === "number"
              ? example
              : undefined;

          const showTip = description !== undefined || example !== undefined;

          const hasError = !!props.form.formState.errors[param.name];

          const placeholder = url.includes(`{${param.name}}`)
            ? `{${param.name}}`
            : url.includes(`:${param.name}`)
              ? `:${param.name}`
              : "Value";

          return (
            <FormField
              key={param.name}
              control={props.form.control}
              name={param.name}
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "space-y-0",
                    i !== props.parameters.length - 1 && "border-b",
                  )}
                >
                  <div
                    key={param.name}
                    className={cn(
                      "grid items-center",
                      param.name === "chain"
                        ? "grid-cols-1 lg:grid-cols-2"
                        : "grid-cols-2",
                    )}
                  >
                    <div className="flex h-full flex-row flex-wrap items-center justify-between gap-1 border-r px-3 py-2">
                      <div className="font-medium font-mono text-sm">
                        {param.name}
                      </div>
                      {param.required && (
                        <Badge
                          className="px-2 text-muted-foreground"
                          variant="secondary"
                        >
                          Required
                        </Badge>
                      )}
                    </div>
                    <div className="relative">
                      {param.name === "chain" ? (
                        <SingleNetworkSelector
                          chainId={
                            field.value ? Number(field.value) : undefined
                          }
                          onChange={(chainId) => {
                            field.onChange({
                              target: { value: chainId.toString() },
                            });
                          }}
                          className="rounded-none border-0 border-t lg:border-none"
                          popoverContentClassName="min-w-[calc(100vw-20px)] lg:min-w-[500px]"
                          chainIds={
                            props.supportedChainIds.length > 0
                              ? props.supportedChainIds
                              : undefined
                          }
                        />
                      ) : (
                        <>
                          <ParameterInput
                            param={param}
                            field={field}
                            showTip={showTip}
                            hasError={hasError}
                            placeholder={placeholder}
                          />

                          {showTip && (
                            <ToolTipLabel
                              hoverable
                              contentClassName="max-w-[100vw] break-all"
                              label={
                                <div className="flex flex-col gap-2">
                                  {description && (
                                    <p className="text-foreground">
                                      {description}
                                    </p>
                                  )}

                                  {exampleToShow !== undefined && (
                                    <div>
                                      <p className="mb-1 text-muted-foreground">
                                        Example:{" "}
                                        <span className="font-mono">
                                          {exampleToShow}
                                        </span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              }
                            >
                              <Button
                                asChild
                                variant="ghost"
                                className="-translate-y-1/2 absolute top-1/2 right-2 hidden h-auto w-auto p-1.5 text-muted-foreground opacity-50 hover:opacity-100 lg:flex"
                              >
                                <div>
                                  <InfoIcon className="size-4" />
                                </div>
                              </Button>
                            </ToolTipLabel>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <FormMessage className="mt-0 border-destructive-text border-t px-3 py-2" />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

function ParameterInput(props: {
  param: OpenAPIV3.ParameterObject;
  field: ControllerRenderProps<
    {
      [x: string]: string | number;
    },
    string
  >;
  showTip: boolean;
  hasError: boolean;
  placeholder: string;
}) {
  const { param, field, showTip, hasError, placeholder } = props;

  if (param.schema && "type" in param.schema && param.schema.enum) {
    const { value, onChange, ...restField } = field;
    return (
      <Select
        {...restField}
        value={value.toString()}
        onValueChange={(v) => {
          onChange({ target: { value: v } });
        }}
      >
        <SelectTrigger
          className={cn(
            "border-none bg-transparent pr-10 font-mono focus:ring-0 focus:ring-offset-0",
            value === "" && "text-muted-foreground",
          )}
          chevronClassName="hidden"
        >
          <SelectValue placeholder="Select" />
        </SelectTrigger>

        <SelectContent className="font-mono">
          {param.schema.enum.map((val) => {
            return (
              <SelectItem value={val} key={val}>
                {val}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      {...field}
      className={cn(
        "h-auto truncate rounded-none border-0 bg-transparent py-3 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
        showTip && "lg:pr-10",
        hasError && "text-destructive-text",
      )}
      placeholder={placeholder}
    />
  );
}

function formatMilliseconds(ms: number) {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

function ResponseSection(props: {
  isPending: boolean;
  response:
    | { data: undefined | string; status?: number; time: number }
    | undefined;
  abortRequest: () => void;
}) {
  const trackEvent = useTrack();
  const formattedData = useMemo(() => {
    if (!props.response?.data) return undefined;
    try {
      return JSON.stringify(JSON.parse(props.response.data), null, 2);
    } catch {
      return props.response.data;
    }
  }, [props.response]);

  return (
    <div className="flex h-full grow flex-col">
      <div className="flex min-h-[60px] items-center justify-between gap-2 border-b p-4 text-sm">
        <div className="flex items-center gap-2">
          <ArrowDownLeftIcon className="size-5" />
          Response
          {props.isPending && <ElapsedTimeCounter />}
          {props.response?.time && !props.isPending && (
            <span className="text-muted-foreground">
              {formatMilliseconds(props.response.time)}
            </span>
          )}
        </div>
        {!props.isPending && props.response?.status && (
          <Badge
            variant={
              props.response.status >= 200 && props.response.status < 300
                ? "success"
                : "destructive"
            }
          >
            {props.response.status}
          </Badge>
        )}
      </div>

      {props.isPending && (
        <div className="flex grow flex-col items-center justify-center gap-4">
          <Spinner className="size-14 text-muted-foreground" />
          <Button variant="ghost" onClick={props.abortRequest} size="sm">
            Cancel
          </Button>
        </div>
      )}

      {!props.isPending && !props.response && (
        <div className="flex grow flex-col items-center justify-center p-4">
          <div>
            <div className="flex justify-center">
              <div className="rounded-xl border p-1">
                <div className="rounded-lg border bg-muted/50 p-1.5">
                  <PlayIcon className="size-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-center">Click Run to start a request</p>
          </div>
        </div>
      )}

      {!props.isPending && props.response && (
        <CodeClient
          lang="json"
          code={formattedData || ""}
          className="rounded-none border-none bg-transparent"
          scrollableContainerClassName="h-full"
          scrollableClassName="h-full"
          shadowColor="hsl(var(--muted)/50%)"
          onCopy={() => {
            trackEvent({
              category: trackingCategory,
              action: "click",
              label: "copy-response",
            });
          }}
        />
      )}
    </div>
  );
}

function openAPIV3ParamToZodFormSchema(
  schema: BlueprintParameter["schema"],
  isRequired: boolean,
): z.ZodTypeAny | undefined {
  if (!schema) {
    return;
  }

  if ("anyOf" in schema) {
    const anyOf = schema.anyOf;
    if (!anyOf) {
      return;
    }
    const anySchemas = anyOf
      .map((s) => openAPIV3ParamToZodFormSchema(s, isRequired))
      .filter((x) => !!x);
    // @ts-expect-error - Its ok, z.union is expecting tuple type but we have array
    return z.union(anySchemas);
  }

  if (!("type" in schema)) {
    return;
  }

  // if enum values
  const enumValues = schema.enum;
  if (enumValues) {
    const enumSchema = z.enum(
      // @ts-expect-error - Its correct
      enumValues,
    );

    if (isRequired) {
      return enumSchema;
    }

    return enumSchema.or(z.literal(""));
  }

  switch (schema.type) {
    case "integer": {
      const intSchema = z.coerce
        .number({
          message: "Must be an integer",
        })
        .int({
          message: "Must be an integer",
        });
      return isRequired
        ? intSchema.min(1, {
            message: "Required",
          })
        : intSchema.optional();
    }

    case "number": {
      const numberSchema = z.coerce.number();
      return isRequired
        ? numberSchema.min(1, {
            message: "Required",
          })
        : numberSchema.optional();
    }

    case "boolean": {
      const booleanSchema = z.coerce.boolean();
      return isRequired ? booleanSchema : booleanSchema.optional();
    }

    // everything else - just accept it as a string;
    default: {
      const stringSchema = z.string();
      return isRequired
        ? stringSchema.min(1, {
            message: "Required",
          })
        : stringSchema.optional();
    }
  }
}

function createParametersFormSchema(parameters: BlueprintParameter[]) {
  const shape: z.ZodRawShape = {};
  for (const param of parameters) {
    const paramSchema = openAPIV3ParamToZodFormSchema(
      param.schema,
      !!param.required,
    );
    if (paramSchema) {
      shape[param.name] = paramSchema;
    } else {
      shape[param.name] = param.required
        ? z.string().min(1, { message: "Required" })
        : z.string();
    }
  }

  return z.object(shape);
}

function createBlueprintUrl(options: {
  parameters: BlueprintParameter[];
  values: Record<string, string>;
  clientId: string;
  domain: string;
  path: string;
  intent: "copy" | "run";
}) {
  const { parameters, domain, path, values, clientId } = options;

  let url = `${domain}${path}`;
  // loop over the values and replace {x} or :x  with the actual values for paths
  // and add query parameters
  const pathVariables = parameters.filter((param) => param.in === "path");

  const queryParams = parameters.filter((param) => param.in === "query");

  for (const parameter of pathVariables) {
    const value = values[parameter.name];
    if (value) {
      url = url.replace(`{${parameter.name}}`, value);
      url = url.replace(`:${parameter.name}`, value);
    }
  }

  const searchParams = new URLSearchParams();
  for (const parameter of queryParams) {
    const value = values[parameter.name];
    if (value) {
      searchParams.append(parameter.name, value);
    }
  }

  // add client Id search param
  if (options.intent === "copy") {
    searchParams.append("clientId", clientId);
  }

  if (searchParams.toString()) {
    url = `${url}?${searchParams.toString()}`;
  }

  return url;
}

function ElapsedTimeCounter() {
  const [ms, setMs] = useState(0);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const internal = 100;
    const id = setInterval(() => {
      setMs((prev) => prev + internal);
    }, internal);

    return () => clearInterval(id);
  }, []);

  return (
    <span className="fade-in-0 animate-in text-muted-foreground text-sm duration-300">
      {formatMilliseconds(ms)}
    </span>
  );
}

function isOpenAPIV3ParameterObject(
  x: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject,
): x is OpenAPIV3.ParameterObject {
  return !("$ref" in x);
}
