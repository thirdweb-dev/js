import { CopyTextButton } from "@/components/ui/CopyTextButton";

export function ClientIDSection(props: { clientId: string }) {
  return (
    <div>
      <h3 className="mb-1 text-base text-foreground font-medium">Client ID</h3>
      <p className="mb-3 text-muted-foreground text-sm">
        Identifies your application
      </p>

      <CopyTextButton
        className="!h-auto w-full max-w-[400px] justify-between truncate bg-background px-3 py-3 font-mono"
        copyIconPosition="right"
        textToCopy={props.clientId}
        textToShow={props.clientId}
        tooltip="Copy Client ID"
      />
    </div>
  );
}
