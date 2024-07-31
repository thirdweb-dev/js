import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";

export function InfoCard(props: {
  title: string;
  links?: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl px-4 py-4 bg-secondary relative">
      <h2 className="text-xl font-semibold tracking-tight mb-4">
        {props.title}
      </h2>

      <div className="[&_p]:mb-3 [&_p]:text-secondary-foreground max-w-[1000px]">
        {props.children}
      </div>

      {props.links && (
        <div className="flex flex-col lg:flex-row mt-7 gap-3">
          {props.links.map((link) => {
            return (
              <Button asChild variant="outline" key={link.label}>
                <Link
                  href={link.href}
                  className="items-center gap-2"
                  target="_blank"
                >
                  {link.label}{" "}
                  <ExternalLinkIcon className="size-3 text-muted-foreground" />
                </Link>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
