"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowDownToLineIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { apiServerProxy } from "@/actions/proxies";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";

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
    body: JSON.stringify({
      name: data.name,
      url,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    pathname: `/v1/teams/${teamIdOrSlug}/engine`,
  });

  if (!res.ok) {
    throw new Error(res.error);
  }
}

export function ImportEngineButton(props: {
  prefillImportUrl: string | undefined;
  teamSlug: string;
  projectSlug: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useDashboardRouter();
  const form = useForm<ImportEngineParams>({
    resolver: zodResolver(formSchema),
    values: {
      name: "",
      url: props.prefillImportUrl || "",
    },
  });

  const importMutation = useMutation({
    mutationFn: async (importParams: ImportEngineParams) => {
      await importEngine({ ...importParams, teamIdOrSlug: props.teamSlug });
      router.refresh();
    },
  });

  const onSubmit = async (data: ImportEngineParams) => {
    try {
      await importMutation.mutateAsync(data);
      toast.success("Engine imported successfully");
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 rounded-full bg-card"
          size="sm"
          variant="outline"
        >
          <ArrowDownToLineIcon className="size-3.5" />
          Import Engine
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 rounded-lg overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="p-4 lg:p-6">
              <DialogTitle>Import Engine Instance</DialogTitle>
              <DialogDescription>
                Import an Engine instance hosted on your infrastructure.
              </DialogDescription>
            </DialogHeader>

            <div className="px-4 lg:px-6 pb-6">
              <Link
                className="mb-4 flex items-center justify-between gap-2 rounded-full border border-border bg-card p-3 text-sm hover:bg-accent"
                href="https://portal.thirdweb.com/engine/v2/get-started"
                rel="noopener noreferrer"
                target="_blank"
              >
                Get help setting up Engine for free
                <ExternalLinkIcon className="size-4 text-muted-foreground" />
              </Link>

              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-card"
                          autoFocus
                          placeholder="Enter a descriptive label"
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
                          className="bg-card"
                          placeholder="Enter your Engine URL"
                          type="url"
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

            <div className="border-t bg-card p-6 flex justify-end">
              <Button className="gap-2 rounded-full" type="submit">
                {importMutation.isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <ArrowDownToLineIcon className="size-4" />
                )}
                Import
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
