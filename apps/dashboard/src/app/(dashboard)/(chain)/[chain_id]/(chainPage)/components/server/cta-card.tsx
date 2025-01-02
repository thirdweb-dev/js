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
      className="overflow-hidden rounded-xl border border-border bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${props.backgroundImageUrl})`,
      }}
    >
      <div className="grid items-center justify-center gap-6 bg-gradient-to-r from-background to-background/50 p-8 md:grid-cols-[1fr_auto] md:gap-12">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="font-bold text-2xl text-foreground tracking-tighter md:max-w-[85%] md:text-3xl">
            {props.title}
          </h2>
          {props.description && (
            <p className="max-w-[600px] text-muted-foreground text-sm leading-relaxed md:text-base">
              {props.description}
            </p>
          )}
        </div>
        <Button asChild>
          <Link
            href={props.buttonLink}
            prefetch={false}
            target={props.buttonLink.startsWith("http") ? "_blank" : undefined}
            className="font-semibold"
          >
            {props.buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
}
