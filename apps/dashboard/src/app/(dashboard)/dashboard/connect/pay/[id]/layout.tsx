import { TabPathLinks } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { getApiKeys } from "../../../../../api/lib/getAPIKeys";
import { APIKeySelector } from "../components/APIKeySelector";

export default async function Layout(props: {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const apiKeys = await getApiKeys();
  const firstKey = apiKeys[0];

  if (!firstKey) {
    redirect("/dashboard/connect/pay/no-keys");
  }

  const selectedKey = apiKeys.find((x) => x.id === params.id);

  if (!selectedKey) {
    redirect("/dashboard/connect/pay");
  }

  const layoutPath = `/dashboard/connect/pay/${selectedKey.id}`;

  return (
    <div>
      <div className="relative flex w-full flex-col gap-4 lg:flex-row">
        <div className="right-0 bottom-3 z-10 max-sm:w-full lg:absolute lg:min-w-[200px]">
          <APIKeySelector apiKeys={apiKeys} selectedApiKey={selectedKey} />
        </div>

        <TabPathLinks
          className="w-full"
          links={[
            {
              name: "Analytics",
              path: layoutPath,
              exactMatch: true,
            },
            {
              name: "Webhooks",
              path: `${layoutPath}/webhooks`,
            },
            {
              name: "Settings",
              path: `${layoutPath}/settings`,
            },
          ]}
        />
      </div>

      <div className="h-4" />

      {props.children}
    </div>
  );
}
