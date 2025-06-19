"use client";

import { apiServerProxy } from "@/actions/proxies";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CircleAlertIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
});

type ImportEngineParams = z.infer<typeof formSchema>;

async function importEngine({
  teamIdOrSlug,
  ...data
}: ImportEngineParams & { teamIdOrSlug: string }) {
  // Instance URLs should end with a /.
  const url = data.url.endsWith("/") ? data.url : `${data.url}/`;

  const res = await apiServerProxy({
    pathname: `/v1/teams/${teamIdOrSlug}/engine`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      url,
    }),
  });

  if (!res.ok) {
    throw new Error(res.error);
  }
}

export function EngineImportCard(props: {
  prefillImportUrl: string | undefined;
  teamSlug: string;
  projectSlug: string;
}) {
  const router = useDashboardRouter();

  return (
    <EngineImportCardUI
      prefillImportUrl={props.prefillImportUrl}
      importEngine={async (params) => {
        await importEngine({ ...params, teamIdOrSlug: props.teamSlug });
        router.push(
          `/team/${props.teamSlug}/${props.projectSlug}/engine/dedicated`,
        );
      }}
    />
  );
}

export function EngineImportCardUI(props: {
  prefillImportUrl: string | undefined;
  importEngine: (params: ImportEngineParams) => Promise<void>;
}) {
  const form = useForm<ImportEngineParams>({
    resolver: zodResolver(formSchema),
    values: {
      name: "",
      url: props.prefillImportUrl || "",
    },
  });

  const importMutation = useMutation({
    mutationFn: props.importEngine,
  });

  const onSubmit = async (data: ImportEngineParams) => {
    try {
      await importMutation.mutateAsync(data);
      toast.success("Engine imported successfully");
    } catch (e) {
      const message = e instanceof Error ? e.message : undefined;
      toast.error(
        "Error importing Engine. Please check if the details are correct.",
        {
          description: message,
        },
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-lg border border-border bg-card">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Card */}
          <div className="p-6">
            <div>
              <h1 className="mb-1 font-semibold text-xl tracking-tight">
                Import Engine Instance
              </h1>

              <p className="text-muted-foreground text-sm">
                Import an Engine instance hosted on your infrastructure
              </p>

              <div className="h-4" />

              <Link
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 text-sm hover:bg-accent"
                href="https://portal.thirdweb.com/infrastructure/engine/get-started"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get help setting up Engine for free
                <ExternalLinkIcon className="size-4 text-muted-foreground" />
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a descriptive label"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="Enter your Engine URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="mt-3 flex items-center gap-2">
                      <CircleAlertIcon className="size-3 shrink-0 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        Do not import a URL you do not recognize.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="h-8" />

          <div className="flex justify-end border-border border-t p-6">
            <Button type="submit" className="min-w-28 gap-2">
              {importMutation.isPending ? (
                <Spinner className="size-4" />
              ) : (
                <DownloadIcon className="size-4" />
              )}
              Import
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
