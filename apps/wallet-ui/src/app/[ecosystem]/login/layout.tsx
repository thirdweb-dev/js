export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  console.log("login layout");
  return (
    <main className="flex flex-col items-center justify-center w-full">
      {children}
    </main>
  );
}
