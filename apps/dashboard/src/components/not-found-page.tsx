import { TrackedLinkTW } from "@/components/ui/tracked-link";

export function NotFoundPage() {
  return (
    <div className="overflow-hidden">
      <div className="container flex h-full min-h-dvh flex-col justify-center">
        <div className="flex flex-col items-center">
          <div className="z-10 flex size-[90px] items-center justify-center rounded-3xl border bg-background font-semibold text-2xl text-muted-foreground tracking-tight shadow-lg md:size-[100px] md:text-3xl">
            404
          </div>

          <div className="h-8" />

          <p className="text-center font-bold text-3xl tracking-tighter md:text-5xl">
            <span className="block"> Uh oh. </span>
            <span className="block">Looks like web3</span>
            <span className="block">can't be found here.</span>
          </p>

          <div className="h-12" />

          <div>
            <p className="text-center text-muted-foreground text-xl leading-7">
              Try our{" "}
              <TrackedLinkTW
                category="page-not-found"
                label="homepage"
                href="/home"
                className="text-foreground hover:underline"
              >
                homepage
              </TrackedLinkTW>
              ,{" "}
              <TrackedLinkTW
                category="page-not-found"
                label="dashboard"
                href="/team"
                className="text-foreground hover:underline"
              >
                dashboard
              </TrackedLinkTW>{" "}
              or{" "}
              <TrackedLinkTW
                category="page-not-found"
                label="portal"
                href="https://portal.thirdweb.com"
                className="text-foreground hover:underline"
              >
                developer portal
              </TrackedLinkTW>{" "}
              instead
            </p>
          </div>

          <Aurora
            color="hsl(var(--foreground)/8%)"
            pos={{ top: "40%", left: "50%" }}
            size={{ width: "100vw", height: "100vh" }}
          />
        </div>
      </div>
    </div>
  );
}

type AuroraProps = {
  size: { width: string; height: string };
  pos: { top: string; left: string };
  color: string;
};

const Aurora: React.FC<AuroraProps> = ({ color, pos, size }) => {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: pos.top,
        left: pos.left,
        width: size.width,
        height: size.height,
        transform: "translate(-50%, -50%)",
        backgroundImage: `radial-gradient(ellipse at center, ${color}, transparent 60%)`,
      }}
    />
  );
};
