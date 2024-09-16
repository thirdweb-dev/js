"use client";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function Banner(props: { text: string; href: string; id: string }) {
	const [showBanner, setShowBanner] = useState(false);

	const bannerCancelledKey = "banner-cancelled" + props.href;

	useEffect(() => {
		if (localStorage.getItem(bannerCancelledKey) !== "true") {
			setShowBanner(true);
		}
	}, [bannerCancelledKey]);

	if (!showBanner) {
		return null;
	}

	return (
		<div
			className="animate-in fade-in-0 flex items-center justify-center gap-2 p-3 pr-20 transition-opacity duration-700"
			style={{
				background: `linear-gradient(145.96deg, rgb(65, 10, 182) 5.07%, rgb(60 132 246) 100%)`,
			}}
		>
			<Link
				href={props.href}
				target={props.href.startsWith("http") ? "_blank" : undefined}
				className="font-bold hover:underline"
				style={{
					color: "white",
				}}
			>
				{props.text}
			</Link>
			<Button
				className="absolute right-4 shrink-0 bg-transparent bg-none p-1"
				onClick={() => {
					setShowBanner(false);
					localStorage.setItem(bannerCancelledKey, "true");
				}}
			>
				<XIcon
					className="size-5 "
					style={{
						color: "white",
					}}
				/>
			</Button>
		</div>
	);
}
