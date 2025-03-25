import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { getBridgePaths } from "./utils";

export default async function Page() {
  try {
    const paths = await getBridgePaths();
    return (
      <div className="pb-20">
        <h2 className="mb-2 font-semibold text-2xl tracking-tight">
          Universal Bridge REST API
        </h2>
        <p className="mb-5 text-muted-foreground">
          Directly interact with the Universal Bridge API from your backend,
          using standard REST api.
        </p>

        <div className="flex flex-col gap-8">
          <BlueprintSection
            title="Available endpoints"
            blueprints={paths.map(([pathName, pathObj]) => {
              if (!pathObj) {
                throw new Error(`Path not found: ${pathName}`);
              }
              return {
                name: pathName,
                description: pathObj.get?.description || "",
                link: `/connect/pay/backend/reference?route=${pathName}`,
              };
            })}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <div>Error fetching API spec</div>;
  }
}

function BlueprintSection(props: {
  title: string;
  blueprints: { name: string; description: string; link: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b bg-accent/20 px-6 py-4">
        <h2 className="font-semibold text-lg tracking-tight">{props.title}</h2>
      </div>
      <Table>
        <TableBody>
          {props.blueprints.map((item) => (
            <TableRow
              key={item.link}
              className="group hover:bg-accent/50"
              linkBox
            >
              <TableCell>
                <span className="flex items-center gap-3">
                  <Link
                    href={item.link}
                    className="before:absolute before:inset-0"
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-md">{item.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
