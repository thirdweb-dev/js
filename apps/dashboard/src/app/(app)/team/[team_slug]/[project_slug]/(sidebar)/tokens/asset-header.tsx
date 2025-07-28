import { TabPathLinks } from "@/components/ui/tabs";

export function AssetsHeader(props: { teamSlug: string; projectSlug: string }) {
  return (
    <div>
      <div className="container max-w-7xl pt-8 pb-4">
        <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
          Tokens
        </h1>
        <p className="text-muted-foreground">
          Create and manage tokens for your project
        </p>
      </div>

      <TabPathLinks
        scrollableClassName="container max-w-7xl"
        links={[
          {
            name: "Tokens",
            path: `/team/${props.teamSlug}/${props.projectSlug}/tokens`,
          },
          {
            name: "NFT Marketplace",
            path: `/team/${props.teamSlug}/${props.projectSlug}/tokens/marketplace`,
          },
        ]}
      />
    </div>
  );
}
