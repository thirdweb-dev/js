import { pageProcessing } from "../_common/pageProcessing";
import { ClientPage } from "../client/_page";
import { IdbPersistProvider } from "./idb-persister";

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const range = await pageProcessing(props);

  return (
    <IdbPersistProvider>
      <ClientPage range={range} />
    </IdbPersistProvider>
  );
}
