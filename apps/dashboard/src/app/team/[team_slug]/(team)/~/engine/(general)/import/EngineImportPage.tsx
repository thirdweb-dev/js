"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { FormControl } from "@chakra-ui/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import {
  CircleAlertIcon,
  CloudDownloadIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormLabel } from "tw-components";

type ImportEngineInput = {
  name: string;
  url: string;
};

export const EngineImportPage = (props: {
  importUrl?: string;
  teamSlug: string;
}) => {
  const { importUrl } = props;
  const router = useDashboardRouter();

  const form = useForm<ImportEngineInput>({
    defaultValues: {
      name: "",
      url: importUrl ? decodeURIComponent(importUrl) : undefined,
    },
  });

  const onSubmit = async (data: ImportEngineInput) => {
    try {
      // Instance URLs should end with a /.
      const url = data.url.endsWith("/") ? data.url : `${data.url}/`;

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine`, {
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
        throw new Error(`Unexpected status ${res.status}`);
      }

      toast.success("Engine imported successfully");
      router.push(`/team/${props.teamSlug}/~/engine`);
    } catch {
      toast.error(
        "Error importing Engine. Please check if the details are correct.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-[550px]">
      <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
        Import Engine Instance
      </h1>

      <div className="h-3" />

      <p className="text-muted-foreground">
        Import an Engine instance hosted on your infrastructure.
      </p>

      <div className="h-3" />

      <TrackedLinkTW
        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 p-3 text-sm hover:bg-accent"
        href="https://portal.thirdweb.com/infrastructure/engine/get-started"
        target="_blank"
        category="engine"
        label="clicked-self-host-instructions"
      >
        Get help setting up Engine for free
        <ExternalLinkIcon className="size-4" />
      </TrackedLinkTW>

      <div className="h-10" />

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter a descriptive label"
              autoFocus
              {...form.register("name", {
                required: "Name is required",
              })}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>URL</FormLabel>
            <Input
              type="url"
              placeholder="Enter your Engine URL"
              {...form.register("url", {
                required: "URL is required",
              })}
            />
            <div className="mt-2 flex items-center gap-2">
              <CircleAlertIcon className="!static size-3 text-warning-foreground" />
              <p className="text-muted-foreground text-sm">
                Do not import a URL you do not recognize.
              </p>
            </div>
          </FormControl>
        </div>

        <div className="h-10" />

        <Button
          type="submit"
          variant="primary"
          className="w-full gap-2 text-base"
        >
          <CloudDownloadIcon className="size-4" />
          Import
        </Button>
      </form>
    </div>
  );
};
