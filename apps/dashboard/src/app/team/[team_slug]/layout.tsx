import { AppFooter } from "@/components/blocks/app-footer";
import { TWAutoConnect } from "../../components/autoconnect";

export default function RootTeamLayout(props: {
  children: React.ReactNode;
  params: { team_slug: string };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow flex flex-col">{props.children}</div>
      <TWAutoConnect />
      <AppFooter />
    </div>
  );
}
