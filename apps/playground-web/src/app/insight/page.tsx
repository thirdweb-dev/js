import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { insightBlueprints } from "./insightBlueprints";

export default function Page() {
  return (
    <div>
      <h2 className="mb-2 font-semibold text-2xl tracking-tight">Blueprints</h2>
      <p className="mb-5 text-muted-foreground">
        A blueprint is an API that provides access to on-chain data in a
        user-friendly format. <br /> There is no need for ABIs, decoding, RPC,
        or web3 knowledge to fetch blockchain data.{" "}
        <Link
          className="underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:decoration-solid"
          href="https://portal.thirdweb.com/insight/blueprints?utm_source=playground"
          target="_blank"
        >
          Learn more about Insight Blueprints{" "}
        </Link>
      </p>

      <div className="flex flex-col gap-8">
        {insightBlueprints.map((blueprint) => {
          return (
            <BlueprintSection
              blueprints={blueprint.paths.map((pathInfo) => {
                return {
                  deprecated: pathInfo.deprecated,
                  link: `/insight/${blueprint.id}?path=${pathInfo.path}`,
                  name: pathInfo.name,
                };
              })}
              key={blueprint.id}
              title={blueprint.name}
            />
          );
        })}
      </div>
    </div>
  );
}

function BlueprintSection(props: {
  title: string;
  blueprints: { name: string; link: string; deprecated?: boolean }[];
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
                    className={`${
                      item.deprecated
                        ? "line-through before:absolute before:inset-0"
                        : ""
                    }`}
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                  {item.deprecated && (
                    <span className="rounded bg-destructive/10 px-2 py-0.5 font-medium text-destructive text-xs">
                      Deprecated
                    </span>
                  )}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
