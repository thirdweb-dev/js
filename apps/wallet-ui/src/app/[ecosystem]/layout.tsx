export default function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { ecosystem: string } }) {
  return (
    <div>
      {params.ecosystem}
      {children}
    </div>
  );
}
