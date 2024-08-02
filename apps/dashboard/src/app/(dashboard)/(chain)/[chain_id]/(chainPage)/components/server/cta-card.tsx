import { Button } from "@/components/ui/button";
import Link from "next/link";

export type ChainCTAProps = {
  backgroundImageUrl: string;
  title: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
};

export function ChainCTA(props: ChainCTAProps) {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat rounded-xl border border-border overflow-hidden"
      style={{
        backgroundImage: `url(${props.backgroundImageUrl})`,
      }}
    >
      <div className="grid items-center justify-center gap-6 p-8 sm:p-12 md:grid-cols-[1fr_auto] md:gap-12 lg:p-16 bg-gradient-to-r from-background to-background/90">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl md:max-w-[80%]">
            {props.title}
          </h2>
          {props.description && (
            <p className="max-w-[600px] text-secondary-foreground">
              {props.description}
            </p>
          )}
        </div>
        <Button asChild size="lg">
          <Link
            href={props.buttonLink}
            prefetch={false}
            target={props.buttonLink.startsWith("http") ? "_blank" : undefined}
          >
            {props.buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
}
