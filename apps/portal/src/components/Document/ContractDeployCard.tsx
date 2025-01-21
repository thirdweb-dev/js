import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Paragraph } from "./Paragraph";

/**
 * Usage:
 * ```tsx
 * <ContractDeployCard contractName={"ERC20Modular"} href="deploy-link" />
 * ```
 */
export function ContractDeployCard(props: {
  contractName: string;
  description?: string;
  href: string;
}) {
  return (
    <div className="my-4 rounded-lg border bg-card p-4">
      <div className="mb-2 font-semibold text-lg ">
        Deploy {props.contractName}
      </div>
      <Paragraph className="mb-5 text-base text-muted-foreground">
        {props.description ||
          `The ${props.contractName} is available to deploy on Explore. Deploy it now through dashboard.`}
      </Paragraph>
      <div className="flex">
        <Button asChild variant="outline">
          <Link href={props.href} target="_blank">
            Deploy Now
          </Link>
        </Button>
      </div>
    </div>
  );
}
