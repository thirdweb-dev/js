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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { createSolanaAccount } from "../lib/vault.client";

export function CreateSolanaWallet(props: {
  project: Project;
  teamSlug: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const router = useDashboardRouter();

  const managementAccessToken =
    props.project.services?.find((service) => service.name === "engineCloud")
      ?.managementAccessToken ?? undefined;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!managementAccessToken) {
        throw new Error("No management access token");
      }

      const result = await createSolanaAccount({
        managementAccessToken: managementAccessToken,
        label: label.trim(),
        projectId: props.project.id,
        teamId: props.project.teamId,
      });

      if (!result.success || !result.data) {
        throw result.error || new Error("Failed to create Solana wallet");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Solana wallet created successfully");
      setOpen(false);
      setLabel("");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create Solana wallet",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-1.5 rounded-full bg-background text-foreground"
          disabled={props.disabled}
        >
          <PlusIcon className="size-4" />
          Create Solana Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create Solana Wallet</DialogTitle>
          <DialogDescription>
            Create a new Solana server wallet for your project
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="label">Wallet Label</Label>
              <Input
                id="label"
                placeholder="e.g., Production Wallet"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={createMutation.isPending || !label.trim()}
            >
              {createMutation.isPending ? "Creating..." : "Create Wallet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
