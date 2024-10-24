export default function Layout(props: { children: React.ReactNode }) {
  return props.children;
}

export const revalidate = 300; // 5 minutes
