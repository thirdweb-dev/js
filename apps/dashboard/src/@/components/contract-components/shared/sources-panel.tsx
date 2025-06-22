import type { Abi } from "abitype";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
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
          <SourcesAccordion abi={abi} sources={sources} />
        ) : (
          <p className="text-muted-foreground text-sm">
            Contract source code not available. Try deploying with{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/contracts/deploy/overview"
              rel="noopener noreferrer"
              target="_blank"
            >
              thirdweb CLI v0.5+
            </UnderlineLink>
          </p>
        )}
      </div>
    </div>
  );
};
