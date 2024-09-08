import { EngineMobileSidebar, EngineSidebar } from "./EngineSidebar";

export function EngineGeneralPageLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 container px-4 w-full">
      <EngineSidebar />
      <div className="grow max-sm:w-full pt-6 lg:pt-8">
        <EngineMobileSidebar />
        {props.children}
      </div>
    </div>
  );
}
