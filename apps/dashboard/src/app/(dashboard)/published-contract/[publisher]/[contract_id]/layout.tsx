import { PublishedContractBreadcrumbs } from "./components/breadcrumbs.client";

export default function PublishedContractLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PublishedContractBreadcrumbs />
      <div className="container flex flex-col gap-8 py-8">{props.children}</div>
    </div>
  );
}
