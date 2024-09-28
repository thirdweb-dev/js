import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "components/icons/brand-icons/UnityIcon";
import Link from "next/link";
import { SiUnrealengine } from "react-icons/si";
import { SiDotnet } from "react-icons/si";

export function ConnectSDKCard({
  title,
  description,
}: { title?: string; description?: string }) {
  return (
    <div className="relative rounded-lg border border-border bg-muted/50 p-6">
      <h3 className="mb-1 font-semibold text-2xl tracking-tight">
        {title || "Connect SDK"}
      </h3>
      <p className="mb-8 text-muted-foreground text-sm">
        {description || "Add the Connect SDK to your app."}
      </p>

      <div className="grid max-w-[500px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <DocLink
          link="https://portal.thirdweb.com/typescript/v5/getting-started"
          icon={TypeScriptIcon}
          label="TypeScript SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/react/v5/getting-started"
          icon={ReactIcon}
          label="React SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/react-native/v5/getting-started"
          icon={ReactIcon}
          label="React Native SDK"
        />
        <DocLink
          link="https://portal.thirdweb.com/unity/v4/getting-started"
          icon={UnityIcon}
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
      className="absolute top-4 right-2 bottom-4 z-[1] hidden w-[50%] xl:block"
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
      className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
    >
      <props.icon className="size-4" />
      {props.label}
    </Link>
  );
}
