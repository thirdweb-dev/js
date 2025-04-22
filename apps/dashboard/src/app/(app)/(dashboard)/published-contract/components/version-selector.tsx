import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

type DeployContractVersionSelectorProps = {
  availableVersions: string[];
  version: string;
};

export function DeployContractVersionSelector({
  availableVersions,
  version,
}: DeployContractVersionSelectorProps) {
  const router = useDashboardRouter();
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();

  const { isDeploy, rootPathName } = useMemo(() => {
    return {
      isDeploy: pathname.endsWith("/deploy"),
      rootPathName: pathname
        .replace(/\/deploy$/, "")
        .replace(`/${version}`, ""),
    };
  }, [pathname, version]);

  return (
    <Select
      value={version}
      onValueChange={(val) => {
        if (availableVersions.includes(val)) {
          const stringifiedSearchParams = searchParams?.toString();
          const isLatestVersion = val === availableVersions[0];
          let pathName = isLatestVersion
            ? rootPathName
            : `${rootPathName}/${val}`;

          if (isDeploy) {
            // append the /deploy to the path
            pathName = `${pathName}/deploy`;
          }

          // if any search params, add them to the path
          if (stringifiedSearchParams) {
            pathName = `${pathName}?${stringifiedSearchParams}`;
          }

          router.push(pathName);
        }
      }}
    >
      <SelectTrigger className="min-w-[180px] bg-card hover:bg-accent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableVersions.map((v, idx) => {
          return (
            <SelectItem value={v || "latest"} key={v}>
              {v}
              {idx === 0 && (
                <span className="text-muted-foreground"> (latest) </span>
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
