import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CreateAssetPageHeader(props: {
  teamSlug: string;
  projectSlug: string;
  title: string;
  description: string;
  containerClassName: string;
}) {
  return (
    <div className="border-b">
      <div className="border-b border-dashed py-3">
        <Breadcrumb className={props.containerClassName}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/team/${props.teamSlug}/${props.projectSlug}/tokens`}
                >
                  Tokens
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{props.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 py-8 lg:flex-row lg:items-center lg:justify-between",
          props.containerClassName,
        )}
      >
        <div>
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            {props.title}
          </h1>
          <p className="text-muted-foreground">{props.description}</p>
        </div>
      </div>
    </div>
  );
}
