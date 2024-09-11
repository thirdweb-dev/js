import { ConnectSidebarLayout } from "./DashboardConnectLayout";

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return <ConnectSidebarLayout>{props.children}</ConnectSidebarLayout>;
}
