import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { FormControl } from "@chakra-ui/react";
import {
  CircleAlertIcon,
  CloudDownloadIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDashboardRouter } from "../../../@/lib/DashboardRouter";
import { AppLayout } from "../../../components/app-layouts/app";
import { EngineSidebar } from "../../../components/engine/EngineSidebar";
import { THIRDWEB_API_HOST } from "../../../constants/urls";
import { useSingleQueryParam } from "../../../hooks/useQueryParam";
import { PageId } from "../../../page-id";
import { FormLabel } from "../../../tw-components";
import type { ThirdwebNextPage } from "../../../utils/types";

type ImportEngineInput = {
  name: string;
  url: string;
};

const Page: ThirdwebNextPage = () => {
  const defaultUrl = useSingleQueryParam("importUrl");
  const router = useDashboardRouter();

  const form = useForm<ImportEngineInput>({
    defaultValues: {
      name: "",
      url: defaultUrl ? decodeURIComponent(defaultUrl) : undefined,
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
      router.push("/dashboard/engine");
    } catch {
      toast.error(
        "Error importing Engine. Please check if the details are correct.",
      );
    }
  };

  return (
    <div className="max-w-[550px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Import Engine Instance
      </h1>

      <div className="h-3" />

      <p className="text-muted-foreground">
        Import an Engine instance hosted on your infrastructure.
      </p>

      <div className="h-3" />

      <TrackedLinkTW
        className="p-3 rounded-lg border border-border bg-secondary flex items-center gap-2 justify-between hover:bg-accent text-sm"
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
            <div className="flex items-center gap-2 mt-2">
              <CircleAlertIcon className="size-3 text-warning-foreground !static" />
              <p className="text-sm text-muted-foreground">
                Do not import a URL you do not recognize{" "}
              </p>
            </div>
          </FormControl>
        </div>

        <div className="h-10" />

        <Button
          type="submit"
          variant="primary"
          className="w-full text-base gap-2"
        >
          <CloudDownloadIcon className="size-4" />
          Import
        </Button>
      </form>
    </div>
  );
};

Page.pageId = PageId.EngineCreate;

Page.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <EngineSidebar />
    {page}
  </AppLayout>
);

export default Page;
