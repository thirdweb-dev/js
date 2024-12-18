"use client";

import { TabPathLinks } from "@/components/ui/tabs";

export function ProjectTabs(props: {
  layoutPath: string;
  isOnNebulaWaitList: boolean;
}) {
  const { layoutPath, isOnNebulaWaitList } = props;

  return (
    <TabPathLinks
      tabContainerClassName="px-4 lg:px-6"
      links={[
        {
          path: layoutPath,
          exactMatch: true,
          name: "Overview",
        },
        {
          // directly link to /in-app-wallets to skip 1 redirect and use `isActive` for checking if the tab is active or not
          path: `${layoutPath}/connect/in-app-wallets`,
          name: "Connect",
          isActive: (path) => path.startsWith(`${layoutPath}/connect`),
        },
        {
          path: `${layoutPath}/contracts`,
          name: "Contracts",
        },
        ...(isOnNebulaWaitList
          ? [
              {
                path: `${layoutPath}/nebula`,
                name: "Nebula",
              },
            ]
          : []),
        {
          path: `${layoutPath}/insight`,
          name: "Insight",
        },
        {
          path: `${layoutPath}/settings`,
          name: "Settings",
        },
      ]}
    />
  );
}
