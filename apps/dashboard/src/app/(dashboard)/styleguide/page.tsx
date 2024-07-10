import { Separator } from "../../../@/components/ui/separator";
import { cn } from "../../../@/lib/utils";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="container py-10">
      <h1 className="text-5xl tracking-tighter font-semibold mb-8">
        Styleguide
      </h1>
      <Separator className="my-10" />
      <Colors />
    </div>
  );
}

function Colors() {
  return (
    <div>
      <h2 className="text-2xl mb-5 font-semibold tracking-tight">
        Background Colors
      </h2>
      <div className="flex-col md:flex-row flex gap-4 flex-wrap">
        <BgColorPreview className="bg-background" />
        <BgColorPreview className="bg-secondary" />
        <BgColorPreview className="bg-muted" />
        <BgColorPreview className="bg-accent" />
        <BgColorPreview className="bg-primary" />
        <BgColorPreview className="bg-destructive" />
        <BgColorPreview className="bg-card" />
        <BgColorPreview className="bg-popover" />
        <BgColorPreview className="bg-inverted" />
      </div>

      <Separator className="my-10" />

      <h2 className="text-2xl mb-5 font-semibold tracking-tight">
        Foreground Colors
      </h2>

      <div className="flex flex-col gap-5">
        <TextColorPreview className="text-foreground" />
        <TextColorPreview className="text-secondary-foreground" />
        <TextColorPreview className="text-muted-foreground" />
        <TextColorPreview className="text-accent-foreground" />
        <TextColorPreview className="text-primary-foreground" />
        <TextColorPreview className="text-success-foreground" />
        <TextColorPreview className="text-destructive-foreground" />
        <TextColorPreview className="text-card-foreground" />
        <TextColorPreview className="text-popover-foreground" />
        <TextColorPreview className="text-inverted-foreground bg-inverted" />
      </div>
    </div>
  );
}

function BgColorPreview(props: { className: string }) {
  return (
    <div>
      <p className="mb-1"> {props.className}</p>
      <div
        className={cn(
          "w-full md:w-[200px] h-[100px] rounded-xl shadow-md border",
          props.className,
        )}
      />
    </div>
  );
}

function TextColorPreview(props: { className: string }) {
  return (
    <div className="grid grid-cols-2">
      <p>{props.className}</p>
      <p className={cn("text-base", props.className)}>
        The quick brown fox jumps over the lazy dog
      </p>
    </div>
  );
}
