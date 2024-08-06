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
      <div className="grid items-center justify-center gap-6 p-8 md:grid-cols-[1fr_auto] md:gap-12 bg-gradient-to-r from-background to-background/90">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground md:max-w-[85%]">
            {props.title}
          </h2>
          {props.description && (
            <p className="max-w-[600px] text-secondary-foreground leading-relaxed text-sm md:text-base">
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
