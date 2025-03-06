import { EngineImportCard } from "./EngineImportPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
  searchParams: Promise<{
    importUrl?: string | string[];
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const importUrl =
    typeof searchParams.importUrl === "string"
      ? searchParams.importUrl
      : undefined;

  return (
    <div className="flex grow flex-col justify-center pt-8 pb-20">
      <EngineImportCard
        prefillImportUrl={importUrl ? decodeURIComponent(importUrl) : undefined}
        teamSlug={params.team_slug}
      />
    </div>
  );
}
