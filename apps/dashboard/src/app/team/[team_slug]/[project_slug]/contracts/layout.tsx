export default function Layout(props: {
  children: React.ReactNode;
}) {
  return <div className="container flex grow flex-col">{props.children}</div>;
}
