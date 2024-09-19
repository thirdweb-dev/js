import { TabPathLinks } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { getApiKeys } from "../../../../../api/lib/getAPIKeys";
import { APIKeySelector } from "../components/APIKeySelector";

export default async function Layout(props: {
  params: {
    id: string;
  };
  children: React.ReactNode;
}) {
  const apiKeys = await getApiKeys();
  const firstKey = apiKeys[0];

  if (!firstKey) {
    redirect("/dashboard/connect/pay/no-keys");
  }

  const selectedKey = apiKeys.find((x) => x.id === props.params.id);

  if (!selectedKey) {
    redirect("/dashboard/connect/pay");
  }

  const layoutPath = `/dashboard/connect/pay/${selectedKey.id}`;

  return (
    <div>
      <div className="flex-col gap-4 flex lg:flex-row w-full relative">
        <div className="max-sm:w-full lg:min-w-[200px] lg:absolute right-0 bottom-3 z-10">
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

export const dynamic = "force-dynamic";
