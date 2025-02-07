import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {} from "lucide-react";
import Link from "next/link";
import { fetchAllBlueprints } from "./utils";

export default async function Page() {
  const blueprints = await fetchAllBlueprints();

  return (
    <div className="pb-20">
      <h2 className="mb-2 font-semibold text-2xl tracking-tight">Blueprints</h2>
      <p className="mb-5 text-muted-foreground">
        A blueprint is an API that provides access to on-chain data in a
        user-friendly format. <br /> There is no need for ABIs, decoding, RPC,
        or web3 knowledge to fetch blockchain data.{" "}
        <Link
          href="https://portal.thirdweb.com/insight/blueprints"
          target="_blank"
          className="underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:decoration-solid"
        >
          Learn more about Insight Blueprints{" "}
        </Link>
      </p>

      <div className="flex flex-col gap-8">
        {blueprints.map((blueprint) => {
          const paths = Object.keys(blueprint.openapiJson.paths);

          return (
            <BlueprintSection
              key={blueprint.id}
              blueprintId={blueprint.id}
              title={blueprint.name}
              blueprints={paths.map((pathName) => {
                const pathObj = blueprint.openapiJson.paths[pathName];
                if (!pathObj) {
                  throw new Error(`Path not found: ${pathName}`);
                }
                return {
                  name: pathObj.get?.summary || "Unknown",
                  link: `/insight/${blueprint.id}?path=${pathName}`,
                };
              })}
            />
          );
        })}
      </div>
    </div>
  );
}

function BlueprintSection(props: {
  title: string;
  blueprintId: string;
  blueprints: { name: string; link: string }[];
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
                    {item.name}
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
