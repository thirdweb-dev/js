import type { Abi } from "abitype";
import { Link, Text } from "tw-components";
import type { SourceFile } from "../types";
import { SourcesAccordion } from "./sources-accordion";

interface SourcesPanelProps {
  sources?: SourceFile[];
  abi?: Abi;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, abi }) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {sources && sources?.length > 0 ? (
          <SourcesAccordion sources={sources} abi={abi} />
        ) : (
          <Text>
            Contract source code not available. Try deploying with
            <Link
              href="https://portal.thirdweb.com/contracts/deploy/overview"
              isExternal
              color="primary.500"
            >
              thirdweb CLI v0.5+
            </Link>
          </Text>
        )}
      </div>
    </div>
  );
};
