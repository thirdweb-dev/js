"use client";

import { Breadcrumb } from "@/components/Document/Breadcrumb";
import type { SideBar } from "@/components/Layouts/DocLayout";
import { usePathname } from "next/navigation";

export function GlossaryBreadcrumb(props: { sidebar: SideBar }) {
	const pathname = usePathname();
	const currentLink = props.sidebar.links.find(
		(link) => "href" in link && link.href === pathname,
	);

	if (currentLink && "name" in currentLink) {
		return (
			<Breadcrumb
				crumbs={[
					{
						name: "Glossary",
						href: "/glossary",
					},
					{
						href: pathname,
						name: currentLink.name,
					},
				]}
			/>
		);
	}

	return null;
}
