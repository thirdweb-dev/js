import { SiReact } from "@react-icons/all-files/si/SiReact";
import { SiTypescript } from "@react-icons/all-files/si/SiTypescript";
import { SiUnity } from "@react-icons/all-files/si/SiUnity";
import Link from "next/link";
import { SiUnrealengine } from "react-icons/si";
import { SiDotnet } from "react-icons/si";

export function ConnectSDKCard({
  title,
  description,
}: { title?: string; description?: string }) {
  return (
    <div className="border border-border bg-muted/50 rounded-lg p-6 relative">
      <h3 className="text-2xl font-semibold tracking-tight mb-1">
        {title || "Connect SDK"}
      </h3>
      <p className="mb-8 text-muted-foreground text-sm">
        {description || "Add the Connect SDK to your app."}
      </p>

      <div className="grid gap-6 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[500px]">
        <DocLink
          link="https://portal.thirdweb.com/typescript/v5/getting-started"
          icon={SiTypescript}
          label="TypeScript SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/react/v5/getting-started"
          icon={SiReact}
          label="React SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/react-native/v5/getting-started"
          icon={SiReact}
          label="React Native SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/unity/v4/getting-started"
          icon={SiUnity}
          label="Unity SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/unreal/getting-started"
          icon={SiUnrealengine}
          label="Unreal SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/dotnet/getting-started"
          icon={SiDotnet}
          label=".NET SDK"
        />
      </div>

      <BackgroundPattern />
    </div>
  );
}

function BackgroundPattern() {
  const color = "hsl(var(--foreground)/50%)";
  return (
    <div
      className="hidden xl:block absolute w-[50%] right-2 top-4 bottom-4 z-[1]"
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        maskImage: "linear-gradient(to left, black, transparent)",
      }}
    />
  );
}

function DocLink(props: {
  link: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <Link
      href={props.link}
      target="_blank"
      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm"
    >
      <props.icon className="size-4" />
      {props.label}
    </Link>
  );
}
