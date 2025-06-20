import type { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
  links: [
    {
      href: "/cli",
      name: "Overview",
    },
    {
      href: "/cli/create",
      name: "Create",
    },
    {
      href: "/cli/install",
      name: "Install",
    },
    {
      href: "/cli/build",
      name: "Build",
    },
    {
      href: "/cli/generate",
      name: "Generate",
    },
    {
      href: "/cli/login",
      name: "Login",
    },
    {
      href: "/cli/logout",
      name: "Logout",
    },
    {
      href: "/cli/upload",
      name: "Upload",
    },
    {
      href: "/contracts/deploy/overview",
      name: "Deploy",
    },
    {
      href: "/contracts/publish/overview",
      name: "Publish",
    },
  ],
  name: "thirdweb CLI",
};
