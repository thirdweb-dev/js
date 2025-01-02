import { EngineImportPage } from "./EngineImportPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
  searchParams: Promise<{
    importUrl?: string;
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  return (
    <EngineImportPage
      importUrl={searchParams.importUrl}
      teamSlug={params.team_slug}
    />
  );
}
