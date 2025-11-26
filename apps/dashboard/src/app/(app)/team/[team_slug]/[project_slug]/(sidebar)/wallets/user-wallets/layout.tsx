import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { loginRedirect } from "@/utils/redirects";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const basePath = `/team/${params.team_slug}/${params.project_slug}/wallets/user-wallets`;

  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(basePath);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ProjectPage
      header={{
        icon: WalletProductIcon,
        title: "User Wallets",
        description:
          "Secure, auto-generated wallets created for authenticated users using email, socials, or passkeys",
        actions: null,
        client,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/wallets/users",
          },
        ],
      }}
      tabs={[
        {
          name: "Overview",
          path: `${basePath}`,
          exactMatch: true,
        },
        {
          name: "Configuration",
          path: `${basePath}/configuration`,
        },
        {
          name: "Users",
          path: `${basePath}/users`,
        },
      ]}
    >
      {props.children}
    </ProjectPage>
  );
}
