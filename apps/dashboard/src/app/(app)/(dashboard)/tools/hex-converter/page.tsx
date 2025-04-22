import type { Metadata } from "next";
import { HexConverter } from "./components/HexConverter";

export const metadata: Metadata = {
  title: "thirdweb Hex / Decimal Converter",
  description: "Convert between hexadecimal and decimal numbers.",
};

export default async function Page() {
  return <HexConverter />;
}
