export default function Layout(props: { children: React.ReactNode }) {
	return props.children;
}

export const revalidate = 5 * 60; // 5 minutes
