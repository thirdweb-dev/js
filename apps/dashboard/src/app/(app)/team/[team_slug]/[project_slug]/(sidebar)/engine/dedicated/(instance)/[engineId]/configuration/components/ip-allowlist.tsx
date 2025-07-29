import { isValid } from "ipaddr.js";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/ui/inline-code";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useEngineIpAllowlistConfiguration,
  useEngineSetIpAllowlistConfiguration,
  useHasEngineFeature,
} from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";

type IpForm = {
  raw: string;
};

export function EngineIpAllowlistConfig({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) {
  const { data: existingIpAllowlist } = useEngineIpAllowlistConfiguration({
    authToken,
    instanceUrl,
  });
  const setIpAllowlistMutation = useEngineSetIpAllowlistConfiguration({
    authToken,
    instanceUrl,
  });

  const { isSupported } = useHasEngineFeature(instanceUrl, "IP_ALLOWLIST");

  const form = useForm<IpForm>({
    values: { raw: existingIpAllowlist?.join("\n") ?? "" },
  });

  const onSubmit = async (data: IpForm) => {
    try {
      const ips = data.raw
        .split(/[\n,]/)
        .filter((url) => !!url)
        .map((ip) => ip.trim());

      // Check if all IPs are well formed.
      const incorrectIp = ips.find((ip) => !isValid(ip));

      if (incorrectIp) {
        throw new Error(`Invalid IP Address: ${incorrectIp}`);
      }

      await setIpAllowlistMutation.mutateAsync({ ips });
      toast.success("IP Allowlist updated successfully.");
      form.reset({
        raw: ips.join("\n"),
      });
    } catch (error) {
      toast.error("Failed to update IP Allowlist", {
        description: parseError(error),
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4 lg:p-6 lg:pb-4">
          <h2 className="text-lg font-semibold mb-1">Allowlist IPs</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Specify the IP Addresses that can call Engine (
            <InlineCode code="8.8.8.8" />
            ).
            <br />
            Enter a comma separated list of IPs, or one IP per line, or leave
            this list empty to allow all IPs.
            <br />
            This does not affect Dashboard calls to Engine.
          </p>

          <Textarea
            placeholder={"8.8.8.8\nff06:0:0:0:0:0:0:c3"}
            rows={4}
            {...form.register("raw")}
          />
        </div>

        <div className="flex justify-end border-t border-dashed px-4 py-4 lg:px-6">
          <Button
            size="sm"
            className="gap-2"
            disabled={!form.formState.isDirty}
            type="submit"
          >
            {form.formState.isSubmitting ? (
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
