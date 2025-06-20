import type { Metadata } from "next";
import { HexConverter } from "./components/HexConverter";

export const metadata: Metadata = {
  description: "Convert between hexadecimal and decimal numbers.",
  title: "thirdweb Hex / Decimal Converter",
};

export default async function Page() {
  return <HexConverter />;
}
