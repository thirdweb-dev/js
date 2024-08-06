import Link from "next/link";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Heading } from "@/components/Document";

export type WalletInfo = { href: string; label: string; icon: StaticImport };

export function WalletCard(props: WalletInfo) {
	return (
		<div className="group/wallet-card relative rounded-[26px] border bg-b-800 px-5 py-2 transition-colors hover:border-accent-500 hover:bg-accent-900">
			<div className="mt-[-30px] flex flex-col justify-center gap-1">
				<Link
					href={props.href}
					className="absolute inset-0"
					aria-label={props.label}
				>
					{" "}
				</Link>
				<Image
					src={props.icon}
					alt=""
					className="size-20 rounded-[16px] border bg-b-900 p-2 transition-transform duration-300 group-hover/wallet-card:scale-110 group-hover/wallet-card:border-accent-500 group-hover/wallet-card:bg-accent-900"
				/>
				<Heading
					id={props.label}
					level={3}
					className="text-base font-medium text-f-100 group-hover/wallet-card:text-f-100 md:text-base"
				>
					{props.label}
				</Heading>
			</div>
		</div>
	);
}

export function WalletCardGrid(props: { children: React.ReactNode }) {
	return (
		<div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3">
			{props.children}
		</div>
	);
}
