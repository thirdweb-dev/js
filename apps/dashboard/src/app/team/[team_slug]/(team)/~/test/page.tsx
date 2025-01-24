import { pageProcessing } from "./_common/pageProcessing";
import { ClientPage } from "./client/_page";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const range = await pageProcessing(props);

  return <ClientPage range={range} />;
}
