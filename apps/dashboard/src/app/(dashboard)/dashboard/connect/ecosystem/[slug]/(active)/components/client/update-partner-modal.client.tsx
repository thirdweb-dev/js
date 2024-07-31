"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Ecosystem, Partner } from "../../../../types";
import { UpdatePartnerForm } from "./update-partner-form.client";

export function UpdatePartnerModal({
  children,
  ecosystem,
  partner,
}: { children: React.ReactNode; ecosystem: Ecosystem; partner: Partner }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle>Update {partner.name}</DialogTitle>
        </DialogHeader>
        <UpdatePartnerForm
          ecosystem={ecosystem}
          partner={partner}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
