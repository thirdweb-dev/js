import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function PageHeader(props: {
  title: string;
  description: React.ReactNode;
  docsLink: string;
  icon: React.FC<{ className?: string }>;
  containerClassName?: string;
}) {
  return (
    <div className="mb-8 border-b py-8 relative">
      <div
        className={cn(
          "container max-w-7xl flex-col lg:flex-row flex items-start justify-between gap-4",
          props.containerClassName,
        )}
      >
        {/* Left */}
        <div>
          <div className="flex mb-4">
            <div className="rounded-full border bg-card p-2.5">
              <props.icon className="size-6 text-muted-foreground" />
            </div>
          </div>

          <h1 className="mb-0.5 font-semibold text-3xl tracking-tight">
            {props.title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-4xl">
            {props.description}
          </p>
        </div>

        {/* right */}
        <Button asChild className="rounded-full gap-2 px-4" size="sm">
          <Link href={props.docsLink} target="_blank">
            Documentation
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function PageLayout(props: {
  title: string;
  description: React.ReactNode;
  docsLink: string;
  children: React.ReactNode;
  containerClassName?: string;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <main>
      <PageHeader
        description={props.description}
        docsLink={props.docsLink}
        icon={props.icon}
        title={props.title}
      />
      <div className={cn("container max-w-7xl pb-8", props.containerClassName)}>
        {props.children}
      </div>
    </main>
  );
}
