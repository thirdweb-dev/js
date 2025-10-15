"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { KeyRoundIcon, Loader2Icon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import type { Project } from "@/api/project/projects";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { upgradeAccessTokensForSolana } from "../../lib/vault.client";

const formSchema = z.object({
  secretKey: z.string().min(1, "Secret key is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function UpgradeSolanaPermissions(props: { project: Project }) {
  const router = useDashboardRouter();
  const [isComplete, setIsComplete] = useState(false);

  // Check if this is an ejected vault
  const engineCloudService = props.project.services.find(
    (s) => s.name === "engineCloud",
  );
  const isEjectedVault = !engineCloudService?.encryptedAdminKey;

  const form = useForm<FormValues>({
    defaultValues: {
      secretKey: "",
    },
    resolver: zodResolver(formSchema),
  });

  const upgradeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return upgradeAccessTokensForSolana({
        project: props.project,
        projectSecretKey: data.secretKey,
      });
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Failed to upgrade Solana permissions");
        return;
      }
      setIsComplete(true);
      toast.success("Solana permissions enabled successfully!");
      // Refresh the page after a short delay to show updated state
      setTimeout(() => {
        router.refresh();
      }, 1500);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upgrade Solana permissions",
      );
    },
  });

  if (isComplete) {
    return (
      <Card className="border-success/50 bg-success/5">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-success/10">
              <ShieldCheckIcon className="size-5 text-success" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-success">
                Solana Access Enabled
              </CardTitle>
              <CardDescription>
                Your project now has full Solana functionality
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 rounded-lg bg-background/50 p-3 border border-border/50">
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Refreshing page to load Solana wallets...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
            <KeyRoundIcon className="size-5 text-purple-500" />
          </div>
          <div>
            <CardTitle>Enable Solana Functionality</CardTitle>
            <CardDescription>
              Upgrade your project to support Solana wallets and transactions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTitle>
            {isEjectedVault
              ? "Why do you need my admin key?"
              : "Why do you need my secret key?"}
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-2 text-sm">
            <p>
              Your project was created before Solana support was added. To
              enable Solana features, we need to update your access tokens with
              new permissions.
            </p>
            {isEjectedVault ? (
              <>
                <p>
                  Since you're using an ejected vault, your admin key is used
                  to:
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Create new access tokens with Solana permissions</li>
                  <li>Update your management token with the new permissions</li>
                </ul>
                <p className="font-medium">
                  Your admin key is never stored and is only used during this
                  one-time upgrade process.
                </p>
              </>
            ) : (
              <>
                <p>Your secret key is used to:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Decrypt your existing admin credentials</li>
                  <li>Create new access tokens with Solana permissions</li>
                  <li>Re-encrypt and securely store the updated credentials</li>
                </ul>
                <p className="font-medium">
                  Your secret key is never stored and is only used during this
                  one-time upgrade process.
                </p>
              </>
            )}
          </AlertDescription>
        </Alert>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((data) => upgradeMutation.mutate(data))}
        >
          <div className="space-y-2">
            <Label htmlFor="secretKey">
              {isEjectedVault ? "Vault Admin Key" : "Project Secret Key"}
            </Label>
            <Input
              {...form.register("secretKey")}
              id="secretKey"
              placeholder={
                isEjectedVault
                  ? "Enter your vault admin key"
                  : "Enter your secret key"
              }
              type="password"
              disabled={upgradeMutation.isPending}
              className="font-mono"
            />
            {form.formState.errors.secretKey && (
              <p className="text-destructive text-sm">
                {form.formState.errors.secretKey.message}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              {isEjectedVault
                ? "This is the admin key you received when you ejected your vault"
                : "You can find your secret key in your project settings"}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={upgradeMutation.isPending || !form.formState.isValid}
              className="min-w-[140px]"
            >
              {upgradeMutation.isPending ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Upgrading...
                </>
              ) : (
                "Enable Solana"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
