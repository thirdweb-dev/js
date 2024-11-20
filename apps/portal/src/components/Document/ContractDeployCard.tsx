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
    <div className="my-4 rounded-lg border bg-b-800 p-4">
      <div className="mb-2 font-semibold text-lg ">
        Deploy {props.contractName}
      </div>
      <Paragraph className="mb-5 text-base text-f-300">
        {props.description ||
          `The ${props.contractName} is available to deploy on Explore. Deploy it now through dashboard.`}
      </Paragraph>
      <div className="flex">
        <Link
          href={props.href}
          target="_blank"
          className="inline-flex items-center rounded-lg border bg-[#DB2877] text-sm duration-200 hover:border-f-300"
        >
          <div className="border-l-2 p-2.5 font-semibold">Deploy Now</div>
        </Link>
      </div>
    </div>
  );
}
