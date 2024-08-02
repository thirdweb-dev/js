"use client";

import { TableOfContentsSideBar } from "../../../components/others/TableOfContents";

const onlyShowPostTitle = (h: HTMLHeadingElement) => {
	return h.classList.contains("changelog-title");
};

export function ChangelogIndexTOC() {
	return <TableOfContentsSideBar filterHeading={onlyShowPostTitle} />;
}
