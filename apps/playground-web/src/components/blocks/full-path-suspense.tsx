import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useFullPath } from "@/hooks/full-path";

export function FullPathSuspense(props: {
  render: (fullPath: string) => React.ReactNode;
}) {
  // use pathname to render the fallback
  const pathname = usePathname();
  return (
    <Suspense fallback={props.render(pathname)}>
      <WithFullPath render={props.render} />
    </Suspense>
  );
}

function WithFullPath(props: {
  render: (fullPath: string) => React.ReactNode;
}) {
  // use pathname + search params to render the final result
  const fullPath = useFullPath();
  return props.render(fullPath);
}
