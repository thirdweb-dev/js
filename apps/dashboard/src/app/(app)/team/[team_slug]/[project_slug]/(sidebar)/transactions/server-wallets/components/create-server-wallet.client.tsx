"use client";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "@/api/project/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { createProjectServerWallet } from "../../lib/vault.client";

export function CreateServerWallet(props: {
  project: Project;
  teamSlug: string;
  setAsProjectWallet?: boolean;
  button?: {
    size?: "default" | "sm" | "lg";
    iconClassName?: string;
  };
}) {
  const router = useDashboardRouter();
  const [label, setLabel] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const managementAccessToken =
    props.project.services?.find((service) => service.name === "engineCloud")
      ?.managementAccessToken ?? undefined;

  const createEoaMutation = useMutation({
    mutationFn: async ({
      managementAccessToken,
      label,
    }: {
      managementAccessToken: string;
      label: string;
    }) => {
      const wallet = await createProjectServerWallet({
        label,
        managementAccessToken,
        project: props.project,
        setAsProjectWallet: props.setAsProjectWallet,
      });

      router.refresh();
      setModalOpen(false);
      setLabel("");
      return wallet;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateServerWallet = async () => {
    if (!managementAccessToken) {
      router.push(`/team/${props.teamSlug}/${props.project.slug}/vault`);
    } else {
      await createEoaMutation.mutateAsync({
        label,
        managementAccessToken: managementAccessToken,
      });
    }
  };

  const isLoading = createEoaMutation.isPending;

  return (
    <>
      <Button
        className="gap-1.5 rounded-full bg-background text-foreground"
        variant="outline"
        size={props.button?.size}
        onClick={() =>
          managementAccessToken
            ? setModalOpen(true)
            : router.push(`/team/${props.teamSlug}/${props.project.slug}/vault`)
        }
      >
        {isLoading ? (
          <Spinner
            className={cn(
              "size-4 text-muted-foreground",
              props.button?.iconClassName,
            )}
          />
        ) : (
          <PlusIcon
            className={cn(
              "size-4 text-muted-foreground",
              props.button?.iconClassName,
            )}
          />
        )}

        {managementAccessToken
          ? isLoading
            ? "Creating..."
            : "Create Server Wallet"
          : "Get Started"}
      </Button>

      <Dialog onOpenChange={setModalOpen} open={modalOpen}>
        <DialogContent className="p-0 gap-0">
          <DialogHeader className="p-4 lg:p-6">
            <DialogTitle>Create server wallet</DialogTitle>
          </DialogHeader>

          <div className="px-4 lg:px-6 space-y-2 pb-10">
            <Label className="text-sm font-medium" htmlFor="wallet-label">
              Wallet Label
            </Label>
            <Input
              className="bg-card"
              id="wallet-label"
              onChange={(e) => setLabel(e.target.value)}
              placeholder="My Wallet"
              value={label}
            />
            <p className="text-sm text-muted-foreground">
              Adding a label will help you identify the wallet in the dashboard
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t bg-card p-4 lg:p-6 rounded-b-lg">
            <Button
              disabled={isLoading}
              onClick={() => setModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleCreateServerWallet}
              className="gap-2"
            >
              {isLoading && <Spinner className="size-4" />}
              Create server wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
