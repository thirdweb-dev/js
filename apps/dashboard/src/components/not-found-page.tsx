import Link from "next/link";

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
            <span className="block">Looks like you're lost!</span>
          </p>

          <div className="h-12" />

          <div>
            <p className="text-center text-muted-foreground text-xl leading-7">
              Find live content on our{" "}
              <Link className="text-foreground hover:underline" href="/home">
                homepage
              </Link>
              ,{" "}
              <Link className="text-foreground hover:underline" href="/team">
                dashboard
              </Link>{" "}
              or{" "}
              <Link
                className="text-foreground hover:underline"
                href="https://portal.thirdweb.com"
              >
                developer portal
              </Link>
              .
            </p>
          </div>

          <Aurora
            color="hsl(var(--foreground)/8%)"
            pos={{ left: "50%", top: "40%" }}
            size={{ height: "100vh", width: "100vw" }}
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
        backgroundImage: `radial-gradient(ellipse at center, ${color}, transparent 60%)`,
        height: size.height,
        left: pos.left,
        top: pos.top,
        transform: "translate(-50%, -50%)",
        width: size.width,
      }}
    />
  );
};
