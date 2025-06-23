"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Ecosystem } from "../../../../../types";

export function AddPartnerDialogButton(props: {
  teamSlug: string;
  ecosystem: Ecosystem;
  authToken: string;
}) {
  const addPartnerUrl = `/team/${props.teamSlug}/~/ecosystem/${props.ecosystem.slug}/configuration/add-partner`;

  return (
    <Link href={addPartnerUrl} passHref>
      <Button className="gap-2 max-sm:w-full" size="sm" variant="outline">
        <PlusIcon className="size-4" />
        Add Partner
      </Button>
    </Link>
  );
}
