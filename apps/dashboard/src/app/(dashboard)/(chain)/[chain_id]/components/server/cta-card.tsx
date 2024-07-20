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
    <div className="container">
      <div
        className="w-full overflow-hidden rounded-xl shadow-lg bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${props.backgroundImageUrl})`,
        }}
      >
        <div className="grid items-center justify-center gap-6 bg-gradient-to-r from-accent/0 to-accent/0 p-8 sm:p-12 md:grid-cols-[1fr_auto] md:gap-12 lg:p-16">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
              {props.title}
            </h2>
            {props.description && (
              <p className="max-w-[600px] md:text-lg text-white">
                {props.description}
              </p>
            )}
          </div>
          <Button asChild size="lg" className="invert dark:invert-0">
            <Link
              href={props.buttonLink}
              prefetch={false}
              target={
                props.buttonLink.startsWith("http") ? "_blank" : undefined
              }
            >
              {props.buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
