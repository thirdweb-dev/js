import { CopyTextButton } from "@/components/ui/CopyTextButton";

export function ClientIDSection(props: {
  clientId: string;
}) {
  return (
    <div>
      <h3>Client ID</h3>
      <p className="mb-2 text-muted-foreground text-sm">
        Identifies your application
      </p>

      <CopyTextButton
        textToCopy={props.clientId}
        className="!h-auto w-full max-w-[400px] justify-between truncate bg-background px-3 py-3 font-mono"
        textToShow={props.clientId}
        copyIconPosition="right"
        tooltip="Copy Client ID"
      />
    </div>
  );
}
