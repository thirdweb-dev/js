"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { PlainTextCodeBlock } from "@workspace/ui/components/code/plaintext-code";
import { cn } from "@workspace/ui/lib/utils";
import { formatDate } from "date-fns";
import {
  ChevronRightIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  DotIcon,
  RotateCwIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getWebhookSends,
  resendWebhook,
  type WebhookSend,
} from "@/api/universal-bridge/developer";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { CodeClient } from "@/components/ui/code/code.client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const pageSize = 10;

type WebhookSendsProps = {
  webhookId: string;
  authToken: string;
  projectClientId: string;
  teamId: string;
};

export function WebhookSends(props: WebhookSendsProps) {
  return (
    <WebhookSendsUI
      {...props}
      getWebhookSends={getWebhookSends}
      resendWebhook={resendWebhook}
    />
  );
}

export function WebhookSendsUI(
  props: WebhookSendsProps & {
    getWebhookSends: typeof getWebhookSends;
    resendWebhook: typeof resendWebhook;
  },
) {
  const [page, setPage] = useState(1);
  const [_selectedWebhookSend, setSelectedWebhookSend] =
    useState<WebhookSend | null>(null);
  const [successFilter, _setSuccessFilter] = useState<
    "all" | "success" | "failed"
  >("all");
  const isMobile = useIsMobile();
  const [_isDialogOpen, setIsDialogOpen] = useState(false);
  const isDialogOpen = isMobile && _isDialogOpen;

  const webhookSendsQuery = useQuery({
    queryKey: ["webhook-sends", props.webhookId, page],
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      props.getWebhookSends({
        webhookId: props.webhookId,
        authToken: props.authToken,
        projectClientId: props.projectClientId,
        teamId: props.teamId,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        success:
          successFilter === "all" ? undefined : successFilter === "success",
      }),
    // preserve the previous data when the page changes
    placeholderData: keepPreviousData,
  });

  const totalItems = webhookSendsQuery.data?.pagination.total;
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 1;
  const selectedWebhookSend =
    _selectedWebhookSend || (isMobile ? null : webhookSendsQuery.data?.data[0]);

  return (
    <div className="pt-4">
      <div className="pb-4 border-b">
        <h2 className="text-lg font-semibold">Events</h2>
        {/* show a filter selector here */}
      </div>

      {webhookSendsQuery.isError ? (
        <div className="text-muted-foreground text-base py-20 flex items-center justify-center border-b">
          Failed to load events
        </div>
      ) : (
        <div className="border-b">
          {/* grid */}
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[1fr_750px] ">
            {/* left */}
            <div>
              {webhookSendsQuery.isFetching &&
                Array.from({ length: pageSize }).map(() => (
                  // biome-ignore lint/correctness/useJsxKeyInIterable: ok
                  <WebhookSendCompactInfoSkeleton />
                ))}

              {!webhookSendsQuery.isFetching &&
                webhookSendsQuery.data?.data.map((webhookSend) => (
                  <WebhookSendCompactInfo
                    key={webhookSend.id}
                    webhookSend={webhookSend}
                    isSelected={selectedWebhookSend?.id === webhookSend.id}
                    onSelect={() => {
                      setSelectedWebhookSend(webhookSend);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}

              {!webhookSendsQuery.isFetching &&
                webhookSendsQuery.data?.data.length === 0 && (
                  <div className="text-muted-foreground text-base py-20 flex items-center justify-center">
                    No events found
                  </div>
                )}
            </div>

            {/* right - desktop */}
            <div className="hidden lg:block lg:pl-4 lg:border-l lg:pt-4">
              {webhookSendsQuery.isFetching ? (
                <div className="h-full flex justify-center items-center">
                  <Spinner className="size-10" />
                </div>
              ) : selectedWebhookSend ? (
                <WebhookSendInfo
                  webhookSend={selectedWebhookSend}
                  authToken={props.authToken}
                  projectClientId={props.projectClientId}
                  teamId={props.teamId}
                  resendWebhook={props.resendWebhook}
                />
              ) : null}
            </div>

            {/* Dialog for mobile */}
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setSelectedWebhookSend(null);
                }
              }}
            >
              <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
                {selectedWebhookSend && (
                  <WebhookSendInfo
                    webhookSend={selectedWebhookSend}
                    authToken={props.authToken}
                    projectClientId={props.projectClientId}
                    teamId={props.teamId}
                    resendWebhook={props.resendWebhook}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>

          {totalPages && totalPages > 1 && (
            <div className="py-5 border-t">
              <PaginationButtons
                activePage={page}
                totalPages={totalPages}
                onPageClick={(page) => {
                  setPage(page);
                  setSelectedWebhookSend(null);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WebhookSendInfo(props: {
  webhookSend: WebhookSend;
  authToken: string;
  projectClientId: string;
  teamId: string;
  resendWebhook: typeof resendWebhook;
}) {
  const bodyString = useMemo(() => {
    try {
      if (!props.webhookSend.body) {
        return undefined;
      }

      if (
        typeof props.webhookSend.body === "object" &&
        props.webhookSend.body !== null
      ) {
        return JSON.stringify(props.webhookSend.body, null, 2);
      }

      return undefined;
    } catch {
      return undefined;
    }
  }, [props.webhookSend.body]);

  const responseString: { lang: "json" | "text"; code: string } =
    useMemo(() => {
      if (!props.webhookSend.response) {
        return {
          lang: "text",
          code: "",
        };
      }

      try {
        const json = JSON.parse(props.webhookSend.response);
        return {
          lang: "json",
          code: JSON.stringify(json, null, 2),
        };
      } catch {
        return {
          lang: "text",
          code: props.webhookSend.response,
        };
      }
    }, [props.webhookSend.response]);

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (props.webhookSend.onrampId) {
        const result = await props.resendWebhook({
          onrampId: props.webhookSend.onrampId,
          authToken: props.authToken,
          projectClientId: props.projectClientId,
          teamId: props.teamId,
        });
        return result;
      } else if (props.webhookSend.paymentId) {
        const result = await props.resendWebhook({
          paymentId: props.webhookSend.paymentId,
          authToken: props.authToken,
          projectClientId: props.projectClientId,
          teamId: props.teamId,
        });
        return result;
      } else {
        throw new Error("No transaction or onramp ID found");
      }
    },
    onSuccess: () => {
      toast.success("Webhook resent");
    },
    onError: (error: unknown) => {
      toast.error("Failed to resend webhook", {
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });

  return (
    <div className="pb-6 relative fade-in-0 duration-300 animate-in flex flex-col min-w-0">
      <div className="pr-10">
        <h3 className="text-xl font-semibold mb-1">
          <span>{getWebhookSendTitle(props.webhookSend)}.</span>
          <span>{props.webhookSend.status.toLowerCase()}</span>
        </h3>

        <p className="text-muted-foreground text-sm">
          Sent on{" "}
          {formatDate(
            new Date(props.webhookSend.createdAt),
            "MMM d, yyyy HH:mm:ss",
          )}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="lg:absolute lg:top-0 lg:right-0 gap-2 rounded-lg bg-card mt-4 lg:mt-0"
        onClick={() => resendMutation.mutate()}
      >
        {resendMutation.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <RotateCwIcon className="size-3.5 text-muted-foreground" />
        )}
        Resend
      </Button>

      <div className="h-4" />

      <div className="space-y-4">
        {/* succes */}
        <div>
          <h3 className="text-sm mb-0.5 font-medium">Delivery Status</h3>
          <p className="text-muted-foreground text-sm">
            {" "}
            {props.webhookSend.success ? "Delivered" : "Failed"}{" "}
          </p>
        </div>

        {/* transaction id */}
        {props.webhookSend.transactionId && (
          <div>
            <h3 className="text-sm mb-0.5 font-medium">Transaction ID</h3>
            <CopyTextButton
              copyIconPosition="right"
              textToCopy={props.webhookSend.transactionId}
              textToShow={props.webhookSend.transactionId}
              tooltip="Copy Transaction ID"
              variant="ghost"
              className="text-muted-foreground text-sm -translate-x-1.5 truncate max-w-full"
            />
          </div>
        )}

        {/* Payment ID */}
        {props.webhookSend.paymentId && (
          <CopyTextField
            label="Payment ID"
            value={props.webhookSend.paymentId}
          />
        )}

        {/* onramp id */}
        {props.webhookSend.onrampId && (
          <CopyTextField label="Onramp ID" value={props.webhookSend.onrampId} />
        )}

        {/* event id */}
        {props.webhookSend.id && (
          <CopyTextField label="Event ID" value={props.webhookSend.id} />
        )}

        {/* payload */}
        <div>
          <h3 className="text-sm mb-2 font-medium">Payload</h3>
          <CodeClient
            code={bodyString || ""}
            lang="json"
            scrollableClassName="max-h-[350px]"
            className="[&_code]:text-xs"
          />
        </div>

        {/* response */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Response</h3>
            <DotIcon className="size-3.5 text-muted-foreground hidden" />
            <StatusBadge status={props.webhookSend.responseStatus} />
          </div>

          {responseString.lang === "text" ? (
            <PlainTextCodeBlock
              code={responseString.code}
              scrollableClassName="max-h-[350px]"
              codeClassName="whitespace-pre-wrap text-xs"
            />
          ) : (
            <CodeClient
              code={responseString.code}
              lang="json"
              scrollableClassName="max-h-[350px]"
              className="[&_code]:text-xs"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CopyTextField(props: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm mb-0.5 font-medium"> {props.label}</h3>
      <CopyTextButton
        copyIconPosition="right"
        textToCopy={props.value}
        textToShow={props.value}
        tooltip={`Copy ${props.label}`}
        variant="ghost"
        className="text-muted-foreground text-sm -translate-x-1.5 truncate max-w-full"
      />
    </div>
  );
}

function WebhookSendCompactInfo(props: {
  webhookSend: WebhookSend;
  isSelected: boolean;
  onSelect: (webhookSend: WebhookSend) => void;
}) {
  return (
    <div className="py-2 border-b last:border-b-0 fade-in-0 duration-300 animate-in">
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-3 py-2.5 px-4 h-auto w-full justify-start text-left hover:bg-card rounded-lg",
          props.isSelected && "!bg-accent/70",
        )}
        onClick={() => props.onSelect(props.webhookSend)}
      >
        <StatusBadge status={props.webhookSend.responseStatus} />

        <div className="space-y-1">
          <h3 className="text-sm text-foreground">
            <span>{getWebhookSendTitle(props.webhookSend)}.</span>
            <span>{props.webhookSend.status.toLowerCase()}</span>
          </h3>

          <p className="text-xs text-muted-foreground">
            {formatDate(
              new Date(props.webhookSend.createdAt),
              "MMM d, yyyy HH:mm:ss",
            )}
          </p>
        </div>

        <ChevronRightIcon
          className={cn(
            "size-3.5 ml-auto text-muted-foreground opacity-0 transition-opacity",
            props.isSelected && "opacity-100",
          )}
        />
      </Button>
    </div>
  );
}

function WebhookSendCompactInfoSkeleton() {
  return (
    <div className="h-[77px] flex gap-3 items-center border-b px-4 last:border-b-0">
      <Skeleton className="w-[45px] h-[22px] rounded-full" />
      <div className="space-y-1">
        <Skeleton className="w-[240px] h-4" />
        <Skeleton className="w-[150px] h-3" />
      </div>
    </div>
  );
}

function getWebhookSendTitle(webhookSend: WebhookSend) {
  if (typeof webhookSend.body === "object" && webhookSend.body !== null) {
    if ("type" in webhookSend.body) {
      const type = webhookSend.body.type;
      if (typeof type === "string") {
        return type;
      }
    }
  }

  if (webhookSend.onrampId) {
    return "onramp";
  }

  return "unknown";
}

function StatusBadge(props: { status: number }) {
  const variant =
    props.status >= 200 && props.status < 300 ? "success" : "destructive";

  return (
    <Badge variant={variant} className="px-1.5 gap-1.5">
      {variant === "success" ? (
        <CircleCheckIcon className="size-3 opacity-70" />
      ) : (
        <CircleAlertIcon className="size-3 opacity-70" />
      )}
      {props.status}
    </Badge>
  );
}
