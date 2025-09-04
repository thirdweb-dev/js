import { ScalarApiReference } from "../../components/blocks/scalar-api/ScalarClient";

export default async function ReferencePage() {
  const responses = await fetch("https://api.thirdweb.com/openapi.json");
  const spec = await responses.json();
  return <ScalarApiReference spec={spec} />;
}
