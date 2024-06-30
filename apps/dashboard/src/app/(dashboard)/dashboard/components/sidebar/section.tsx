import { NavLink } from "../../../../components/nav-link.client";
import type { SidebarNavSection } from "./types";

export type SidebarSectionProps = {
  section: SidebarNavSection;
};

export const SidebarSection: React.FC<SidebarSectionProps> = ({ section }) => {
  return (
    <div className="flex flex-col gap-2 h-7 relative">
      {/* title element */}
      <label className="text-sm text-secondary-foreground">
        {section.title}
      </label>
      <nav>
        <ul>
          {section.items.map((item) => (
            <li key={item.id}>
              <NavLink
                prefetch={false}
                href={item.href}
                className="pl-3 border-l-2 h-8 text-sm text-secondary-foreground flex items-center hover:text-accent-foreground hover:border-secondary-foreground"
                activeClassName="border-primary hover:border-primary text-accent-foreground font-semibold"
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
