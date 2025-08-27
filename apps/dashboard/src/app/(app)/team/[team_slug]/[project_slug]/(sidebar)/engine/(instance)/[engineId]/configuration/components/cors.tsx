import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/ui/inline-code";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useEngineCorsConfiguration,
  useEngineSetCorsConfiguration,
} from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";

type CorsForm = {
  raw: string;
};

export function EngineCorsConfig({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) {
  const { data: existingUrls } = useEngineCorsConfiguration({
    authToken,
    instanceUrl,
  });
  const setCorsConfigMutation = useEngineSetCorsConfiguration({
    authToken,
    instanceUrl,
  });

  const form = useForm<CorsForm>({
    values: { raw: existingUrls?.join("\n") ?? "" },
  });

  const onSubmit = async (data: CorsForm) => {
    try {
      const urls = data.raw.split(/[\n,]/).filter((url) => !!url);
      // Assert all URLs are well formed and strip the path.
      const sanitized = urls.map(parseOriginFromUrl);

      await setCorsConfigMutation.mutateAsync({ urls: sanitized });
      toast.success("CORS URLs updated successfully.");
    } catch (error) {
      toast.error("Failed to update CORS URLs.", {
        description: parseError(error),
      });
    }
  };

  return (
    <div className="bg-card rounded-lg border">
      <div className="px-4 lg:px-6 pt-4 lg:pt-6">
        <h2 className="text-lg font-semibold mb-1">Allowlisted Domains</h2>
        <p className="text-sm text-muted-foreground">
          Specify the origins that can call Engine (
          <InlineCode code="https://example.com" />
          ).
          <br />
          Enter one origin per line, or leave this list empty to disallow calls
          from web clients.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4 lg:px-6">
          <Textarea
            placeholder={"https://example.com\nhttp://localhost:3000"}
            rows={4}
            {...form.register("raw")}
          />
        </div>

        <div className="flex justify-end border-t border-dashed px-4 py-4 lg:px-6">
          <Button
            className="gap-2"
            size="sm"
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            {setCorsConfigMutation.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

const parseOriginFromUrl = (url: string) => {
  try {
    const { protocol, origin } = new URL(url);
    if (!(protocol === "http:" || protocol === "https:")) {
      throw new Error("Missing or invalid protocol");
    }
    return origin;
  } catch {
    throw new Error(`Invalid URL: "${url}"`);
  }
};
