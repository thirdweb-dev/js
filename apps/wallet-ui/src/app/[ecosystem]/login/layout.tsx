export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      {children}
    </main>
  );
}
