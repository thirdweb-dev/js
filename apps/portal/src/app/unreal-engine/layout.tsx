import { createMetadata } from "@/components/Document";
import { DocLayout } from "@/components/Layouts/DocLayout";
import { PlatformSelector } from "@/components/others/PlatformSelector";
import { sidebar } from "./sidebar";

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <DocLayout
      sideBar={sidebar}
      editPageButton={true}
      sidebarHeader={
        <div className="flex-col items-center gap-1">
          <p className="py-5 font-semibold text-foreground text-lg">Connect</p>
          <PlatformSelector selected="Unreal Engine" />
        </div>
      }
    >
      {props.children}
    </DocLayout>
  );
}

export const metadata = createMetadata({
  image: {
    title: "Thirdweb Unreal Engine SDK",
    icon: "unreal-engine",
  },
  title: "Thirdweb Unreal Engine SDK",
  description:
    "Seamlessly create In-App Wallets, sign in with email or socials, unlock Account Abstraction features and more.",
});
