export default function Layout(props: {
  children: React.ReactNode;
}) {
  return <div className="container">{props.children}</div>;
}
