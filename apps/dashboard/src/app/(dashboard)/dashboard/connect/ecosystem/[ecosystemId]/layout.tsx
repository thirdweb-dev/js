import { Separator } from "@/components/ui/separator";
import { EcosystemHeader } from "./components/client/ecosystem-header.client";

export default function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { ecosystemId: string } }) {
  return (
    <div className="flex flex-col w-full px-4 py-10">
      <EcosystemHeader ecosystemId={params.ecosystemId} />
      <Separator className="my-6" />
      {children}
    </div>
  );
}
