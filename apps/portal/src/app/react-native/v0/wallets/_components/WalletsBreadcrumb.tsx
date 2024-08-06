import { Breadcrumb } from "@/components/Document";

export function WalletsBreadcrumb(props: { name: string; slug: string }) {
	return (
		<Breadcrumb
			crumbs={[
				{
					name: "React Native",
					href: "/react-native/v0",
				},
				{
					name: "Wallets",
					href: "/react-native/v0/wallets",
				},
				{
					name: props.name,
					href: `/react-native/v0/wallets/${props.slug}`,
				},
			]}
		/>
	);
}
