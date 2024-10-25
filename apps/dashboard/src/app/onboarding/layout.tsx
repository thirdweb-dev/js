import { TWAutoConnect } from "app/components/autoconnect";

export default function OnboardingLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <TWAutoConnect />
      {children}
    </>
  );
}
