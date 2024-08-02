export default function Layout(props: { children: React.ReactNode }) {
	return (
		<main className="container max-w-3xl py-10" data-noindex>
			{props.children}
		</main>
	);
}
