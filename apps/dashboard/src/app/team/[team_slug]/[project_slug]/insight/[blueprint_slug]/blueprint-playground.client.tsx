"use client";

import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { useHeightObserver } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { useEffect, useMemo, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { getVercelEnv } from "../../../../../../lib/vercel-utils";
import type { BlueprintParameter, BlueprintPathMetadata } from "../utils";

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
      domain={`https://{chainId}.insight.${thirdwebDomain}.com`}
      path={props.path}
      isInsightEnabled={props.isInsightEnabled}
      projectSettingsLink={props.projectSettingsLink}
      supportedChainIds={props.supportedChainIds}
    />
  );
}

function modifyParametersForPlayground(_parameters: BlueprintParameter[]) {
  const parameters = [..._parameters];
  // if chainId parameter is not already present - add it, because we need it for the domain
  const chainIdParameter = parameters.find((p) => p.name === "chainId");
  if (!chainIdParameter) {
    parameters.unshift({
      name: "chainId",
      in: "path",
      required: true,
      description: "Chain ID",
      type: "integer",
    });
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
  const parameters = useMemo(() => {
    return modifyParametersForPlayground(props.metadata.parameters);
  }, [props.metadata.parameters]);

  const formSchema = useMemo(() => {
    return createParametersFormSchema(parameters);
  }, [parameters]);

  const defaultValues = useMemo(() => {
    const values: Record<string, string | number> = {};
    for (const param of parameters) {
      values[param.name] = param.default || "";
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

    props.onRun(url);
  }

  // This allows us to always limit the grid height to whatever is the height of left section on desktop
  // so that entire left section is always visible, but the right section has a scrollbar if it exceeds the height of left section
  const { height, elementRef: leftSectionRef } = useHeightObserver();
  const isMobile = useIsMobileViewport();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex grow flex-col">
          <BlueprintMetaHeader
            title={props.metadata.summary}
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
                <div
                  className="flex grow flex-col max-sm:border-b lg:border-r"
                  ref={leftSectionRef}
                >
                  <RequestConfigSection
                    domain={props.domain}
                    parameters={parameters}
                    path={props.path}
                    form={form}
                    supportedChainIds={props.supportedChainIds}
                  />
                </div>

                <div
                  className="flex min-h-[500px] grow flex-col lg:min-h-[740px]"
                  style={{
                    height: !isMobile && height ? `${height}px` : "auto",
                  }}
                >
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
  description: string;
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
            <p className="mt-1 text-muted-foreground text-sm">
              {props.description}
            </p>
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
  form: ParamtersForm;
  domain: string;
  path: string;
  supportedChainIds: number[];
}) {
  const pathVariables = props.parameters.filter((param) => param.in === "path");

  const queryParams = props.parameters.filter((param) => param.in === "query");

  return (
    <div className="flex grow flex-col">
      <div className="flex min-h-[60px] items-center gap-2 border-b p-4 text-sm">
        <ArrowUpRightIcon className="size-5" />
        Request
      </div>

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

      {pathVariables.length > 0 && queryParams.length > 0 && <Separator />}

      {queryParams.length > 0 && (
        <ParameterSection
          parameters={queryParams}
          title="Query Parameters"
          form={props.form}
          domain={props.domain}
          path={props.path}
          supportedChainIds={props.supportedChainIds}
        />
      )}
    </div>
  );
}

type ParamtersForm = UseFormReturn<{
  [x: string]: string | number;
}>;

function ParameterSection(props: {
  parameters: BlueprintParameter[];
  title: string;
  form: ParamtersForm;
  domain: string;
  path: string;
  supportedChainIds: number[];
}) {
  const url = `${props.domain}${props.path}`;
  return (
    <div className="p-4 py-6">
      <h3 className="mb-3 font-medium text-sm"> {props.title} </h3>
      <div className="overflow-hidden rounded-lg border">
        {props.parameters.map((param, i) => {
          const hasError = !!props.form.formState.errors[param.name];
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
                      param.name === "chainId"
                        ? "grid-cols-1 lg:grid-cols-2"
                        : "grid-cols-2",
                    )}
                  >
                    <div className="flex h-full flex-row flex-wrap items-center justify-between gap-1 border-r px-3 py-2">
                      <div className="font-medium font-mono text-sm">
                        {param.name === "chainId" ? "chainId" : param.name}
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
                      {param.name === "chainId" ? (
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
                          <Input
                            {...field}
                            className={cn(
                              "h-auto truncate rounded-none border-0 bg-transparent py-3 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                              param.description && "lg:pr-10",
                              hasError && "text-destructive-text",
                            )}
                            placeholder={
                              url.includes(`{${param.name}}`)
                                ? `{${param.name}}`
                                : url.includes(`:${param.name}`)
                                  ? `:${param.name}`
                                  : "Value"
                            }
                          />
                          {param.description && (
                            <ToolTipLabel label={param.description}>
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
        />
      )}
    </div>
  );
}

function createParametersFormSchema(parameters: BlueprintParameter[]) {
  const shape: z.ZodRawShape = {};
  for (const param of parameters) {
    // integer
    if (param.type === "integer") {
      const intSchema = z.coerce
        .number({
          message: "Must be an integer",
        })
        .int({
          message: "Must be an integer",
        });
      shape[param.name] = param.required
        ? intSchema.min(1, {
            message: "Required",
          })
        : intSchema.optional();
    }

    // default: string
    else {
      shape[param.name] = param.required
        ? z.string().min(1, {
            message: "Required",
          })
        : z.string().optional();
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

const isMobileMedia = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 640px)").matches;
};

function useIsMobileViewport() {
  const [state, setState] = useState(isMobileMedia);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setState(isMobileMedia());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
}
