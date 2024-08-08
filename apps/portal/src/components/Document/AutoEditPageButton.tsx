"use client";

import { usePathname } from "next/navigation";
import { EditPage } from "./EditPage";

export function AutoEditPageButton() {
	const path = usePathname();

	return <EditPage path={path + "/page.mdx"} />;
}
