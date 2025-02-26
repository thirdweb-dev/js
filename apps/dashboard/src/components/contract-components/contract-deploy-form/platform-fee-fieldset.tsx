import Link from "next/link";
import { Fieldset } from "./common";

interface PlatformFeeFieldsetProps {
  isMarketplace: boolean;
}

export const PlatformFeeFieldset: React.FC<PlatformFeeFieldsetProps> = ({
  isMarketplace,
}) => {
  return (
    <Fieldset legend="Platform fees">
      <div className="flex flex-col gap-4 md:flex-row">
        {isMarketplace ? (
          <p className="mb-3 pt-4 text-muted-foreground text-sm italic">
            A 2.5% platform fee is deducted from each sale to support ongoing
            platform operations and improvements.{" "}
            <Link
              target="_blank"
              className="text-blue-500 underline"
              href={
                "https://blog.thirdweb.com/mint-fees-for-contract-deployments-update/"
              }
            >
              Read more.
            </Link>
          </p>
        ) : (
          <p className="mb-3 pt-4 text-muted-foreground text-sm italic">
            A 2.5% platform fee is deducted from each primary sale price to
            support ongoing platform operations and improvements.{" "}
            <Link
              target="_blank"
              className="text-blue-500 underline"
              href={
                "https://blog.thirdweb.com/mint-fees-for-contract-deployments-update/"
              }
            >
              Read more.
            </Link>
          </p>
        )}
      </div>
    </Fieldset>
  );
};
