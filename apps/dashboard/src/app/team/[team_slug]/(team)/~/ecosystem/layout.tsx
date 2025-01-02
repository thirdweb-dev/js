export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex grow flex-col py-8">{props.children}</div>
  );
}
