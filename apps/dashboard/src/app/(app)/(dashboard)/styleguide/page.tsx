import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleAlertIcon } from "lucide-react";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[700px] py-10">
      <h1 className="mb-8 font-semibold text-5xl tracking-tighter">
        Styleguide
      </h1>
      <div className="my-10" />
      <Colors />
    </div>
  );
}

function Colors() {
  return (
    <div>
      <h2 className="mb-5 font-semibold text-2xl tracking-tight">
        Backgrounds
      </h2>
      <div className="flex flex-col flex-wrap gap-4 md:flex-row">
        <BgColorPreview className="bg-background" />
        <BgColorPreview className="bg-card" />
        <BgColorPreview className="bg-muted" />
        <BgColorPreview className="bg-accent" />
      </div>

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">Buttons</h2>

      <ButtonsPreview />

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">
        Disabled Buttons
      </h2>

      <ButtonsPreview disabled />

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">Badges</h2>

      <div className="flex items-center gap-4">
        <Badge> Default </Badge>
        <Badge variant="outline"> Outline </Badge>
        <Badge variant="secondary"> Secondary </Badge>
        <Badge variant="destructive"> Destructive </Badge>
        <Badge variant="success"> Success </Badge>
        <Badge variant="warning"> Warning </Badge>
      </div>

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">
        Foregrounds
      </h2>

      <div className="flex flex-col gap-2">
        <TextColorPreview className="text-foreground" />
        <TextColorPreview className="text-muted-foreground" />
        <TextColorPreview className="text-destructive-text" />
        <TextColorPreview className="text-warning-text" />
        <TextColorPreview className="text-success-text" />
      </div>

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">
        Chart colors
      </h2>

      <div className="flex flex-col flex-wrap gap-4 md:flex-row">
        <ChartColorPreview name="1" />
        <ChartColorPreview name="2" />
        <ChartColorPreview name="3" />
        <ChartColorPreview name="4" />
        <ChartColorPreview name="5" />
      </div>

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">Alerts</h2>

      <div className="flex flex-col gap-6">
        <AlertPreview variant="default" />
        <AlertPreview variant="destructive" />
        <AlertPreview variant="info" />
        <AlertPreview variant="warning" />
      </div>

      <div className="my-10" />

      <div className="flex flex-col gap-6">
        <AlertPreview variant="default" showDescription />
        <AlertPreview variant="destructive" showDescription />
        <AlertPreview variant="info" showDescription />
        <AlertPreview variant="warning" showDescription />
      </div>

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">
        Inputs + Label
      </h2>

      <div className="flex flex-col gap-6">
        <div>
          <Label className="mb-2 block"> Placeholder </Label>
          <Input placeholder="placeholder" />
        </div>

        <div>
          <Label className="mb-2 block"> No value, No placeholder </Label>
          <Input />
        </div>

        <div>
          <Label className="mb-2 block"> Value filled </Label>
          <Input value="some value" />
        </div>

        <div>
          <Label className="mb-2 block">Disabled</Label>
          <Input value="some value" disabled />
        </div>
      </div>

      <div className="my-14" />

      <h2 className="mb-5 font-semibold text-2xl tracking-tight">Checkboxes</h2>

      <div className="flex gap-4">
        <Checkbox />
        <Checkbox checked />
      </div>
    </div>
  );
}

function ButtonsPreview(props: {
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <Button disabled={props.disabled}> Default </Button>
      <Button variant="outline" disabled={props.disabled}>
        Outline
      </Button>
      <Button variant="secondary" disabled={props.disabled}>
        Secondary
      </Button>
      <Button variant="destructive" disabled={props.disabled}>
        Destructive
      </Button>
      <Button variant="primary" disabled={props.disabled}>
        Primary
      </Button>
      <Button variant="ghost" disabled={props.disabled}>
        Ghost
      </Button>
    </div>
  );
}

function AlertPreview(props: {
  variant: "default" | "destructive" | "info" | "warning";
  showDescription?: boolean;
}) {
  return (
    <Alert variant={props.variant}>
      <CircleAlertIcon className="size-4" />
      <AlertTitle>This is {props.variant} alert title</AlertTitle>
      {props.showDescription && (
        <AlertDescription>
          This is the {props.variant} alert description
        </AlertDescription>
      )}
    </Alert>
  );
}

function ChartColorPreview(props: { name: string }) {
  return (
    <div
      className="flex h-[100px] items-center justify-center rounded-lg text-white text-xs md:w-[100px]"
      style={{
        background: `hsl(var(--chart-${props.name}))`,
      }}
    >
      <p className="font-semibold"> chart-{props.name}</p>
    </div>
  );
}

function BgColorPreview(props: { className: string }) {
  return (
    <div
      className={cn(
        "flex h-[150px] w-full items-center justify-center rounded-lg border border-border text-xs md:w-[150px]",
        props.className,
      )}
    >
      <p className="mb-1"> {props.className}</p>
    </div>
  );
}

function TextColorPreview(props: { className: string }) {
  return (
    <p className={cn("rounded-lg text-base", props.className)}>
      {props.className}
    </p>
  );
}
