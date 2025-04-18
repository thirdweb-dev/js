import { BookOpenIcon, PresentationIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function PageHeader(props: {
  title: string;
  description: React.ReactNode;
  docsLink: string;
}) {
  return (
    <div className="mb-8 border-b py-10">
      <div className="container grid grid-cols-1 items-start justify-between gap-6 lg:grid-cols-[1fr_340px] lg:flex-row">
        {/* Left */}
        <div>
          <h1 className="mb-1 font-bold text-3xl tracking-tight lg:text-4xl">
            {props.title}
          </h1>
          <p className="text-balance text-base text-muted-foreground">
            {props.description}
          </p>
        </div>

        {/* right */}
        <div className="flex flex-col gap-3 md:flex-row">
          <Button asChild>
            <Link target="_blank" href={"https://thirdweb.com/dashboard?utm_source=playground"} >
            <PresentationIcon className="mr-2 h-4 w-4" />
              <BookOpenIcon className="mr-2 h-4 w-4" />
              Add instantly
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-card">
            <Link
              target="_blank" href={props.docsLink} 
            >
               <BookOpenIcon className="mr-2 h-4 w-4" />
              Documentation
            </Link>
          </Button>
        </div>
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
}) {
  return (
    <main>
      <PageHeader
        title={props.title}
        description={props.description}
        docsLink={props.docsLink}
      />
      <div className={cn("container pb-8", props.containerClassName)}>
        {props.children}
      </div>
    </main>
  );
}
