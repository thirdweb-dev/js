import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getBridgePaths } from "./utils";

export default async function Page() {
  try {
    const paths = await getBridgePaths();
    return (
      <div className="container pb-20">
        <div className="flex flex-col justify-between md:flex-row md:gap-8">
          <div>
            <h2 className="mb-1 font-semibold text-2xl tracking-tight">
              thirdweb Payments REST API
            </h2>
            <p className="mb-5 text-muted-foreground">
              Directly interact with the thirdweb Payments API from your
              backend, using standard REST APIs.
            </p>
          </div>

          <Link href="https://bridge.thirdweb.com/reference" target="_blank">
            <Button className="max-md:w-full" variant="outline">
              View all endpoints
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          <BlueprintSection
            blueprints={paths
              .filter(
                ([_pathName, pathObj]) => typeof pathObj?.get !== "undefined",
              )
              .map(([pathName, pathObj]) => {
                if (!pathObj) {
                  throw new Error(`Path not found: ${pathName}`);
                }
                return {
                  description: pathObj.get?.description || "",
                  link: `/payments/backend/reference?route=${pathName}`,
                  name: pathName,
                };
              })}
            title="Available GET endpoints"
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
              className="group hover:bg-accent/50"
              key={item.link}
              linkBox
            >
              <TableCell>
                <span className="flex items-center gap-3">
                  <Link
                    className="before:absolute before:inset-0"
                    href={item.link}
                  >
                    <div className="flex flex-col">
                      <p className="font-semibold text-base">{item.name}</p>
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
