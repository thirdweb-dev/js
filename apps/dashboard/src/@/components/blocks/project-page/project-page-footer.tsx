import {
  type FooterCardProps,
  FooterLinksSection,
} from "../../../../app/(app)/team/[team_slug]/[project_slug]/(sidebar)/components/footer/FooterLinksSection";

export type ProjectPageFooterProps = FooterCardProps;

export function ProjectPageFooter(props: ProjectPageFooterProps) {
  return (
    <footer className="container max-w-7xl">
      <FooterLinksSection {...props} />
    </footer>
  );
}
