import { UnderlineLink } from "@/components/ui/UnderlineLink";
import type { Abi } from "abitype";
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
          <p className="text-muted-foreground text-sm">
            Contract source code not available. Try deploying with{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/contracts/deploy/overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              thirdweb CLI v0.5+
            </UnderlineLink>
          </p>
        )}
      </div>
    </div>
  );
};
