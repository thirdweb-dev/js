"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { Ecosystem } from "../../../../../types";
import { AddPartnerForm } from "./add-partner-form.client";

export function AddPartnerDialogButton(props: {
  ecosystem: Ecosystem;
  authToken: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 max-sm:w-full" variant="outline" size="sm">
          <PlusIcon className="size-4" />
          Add Partner
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Add Partner
          </DialogTitle>
        </DialogHeader>
        <AddPartnerForm
          ecosystem={props.ecosystem}
          onPartnerAdded={() => setOpen(false)}
          authToken={props.authToken}
        />
      </DialogContent>
    </Dialog>
  );
}
