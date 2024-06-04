"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { PayEmbed } from "thirdweb/react";
import { CodeExample } from "../code/code-example";

export function StyledPayEmbed() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Embed component
        </h2>
        <p className="max-w-[600px]">
          Inline component that allows users to buy any currency.
          <br />
          Customize theme, currency, amounts, payment methods and more.
        </p>
      </div>

      <CodeExample
        preview={<StyledPayEmbedPreview />}
        code={`
        import { PayEmbed } from "thirdweb/react";

        function App() {
          return (
            <PayEmbed
              client={client}
            />
          );
        };`}
        lang="tsx"
      />
    </>
  );
}

export function StyledPayEmbedPreview() {
  const { theme } = useTheme();

  return (
    <PayEmbed
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
    />
  );
}
