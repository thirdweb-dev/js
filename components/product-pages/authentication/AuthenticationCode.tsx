import { CodeOptionButton, CodeOptions } from "../common/CodeOptionButton";
import { LightMode, SimpleGrid } from "@chakra-ui/react";
import { GeneralCta } from "components/shared/GeneralCta";
import { useState } from "react";
import { Card, CodeBlock } from "tw-components";

//

const codeSnippets = {
  javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

const sdk = new ThirdwebSDK("goerli");

// Login with a single line of code
const payload = await sdk.auth.login();

// And verify the address of the logged in wallet
const address = await sdk.auth.verify(payload);`,
  react: `import { useSDK } from "@thirdweb-dev/react";

export default function App() {
 const sdk = useSDK();

 async function login() {
  // Login with a single line of code
  const payload = await sdk.auth.login();

  // And verify the address of the logged in wallet
  const address = await sdk.auth.verify(payload);
 }
}`,
  python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("goerli")

# Login with a single line of code
payload = sdk.auth.login();

# And verify the address of the logged in wallet
address = sdk.auth.verify(payload);`,
  go: `import "github.com/thirdweb-dev/go-sdk/thirdweb"

func main() {
  sdk, err := thirdweb.NewThirdwebSDK("goerli", nil)

  // Login with a single line of code
  payload, err := sdk.Auth.Login()

  // And verify the address of the logged in wallet
  address, err := sdk.Auth.Verify(payload)
}`,
};

export const AuthenticationCode: React.FC = () => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>("javascript");

  return (
    <>
      <SimpleGrid
        gap={{ base: 2, md: 3 }}
        columns={{ base: 2, md: 4 }}
        justifyContent={{ base: "space-between", md: "center" }}
      >
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="javascript"
        >
          JavaScript
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="python"
        >
          Python
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="react"
        >
          React
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="go"
        >
          Go
        </CodeOptionButton>
      </SimpleGrid>

      <Card
        w={{ base: "full", md: "69%" }}
        borderWidth={0}
        p={0}
        outlineBorder={{
          gradient:
            "linear-gradient(147.15deg, #410AB6 30.17%, #FF8D5C 100.01%)",
          width: "5px",
        }}
      >
        <CodeBlock
          borderWidth={0}
          w="full"
          py={4}
          code={codeSnippets[activeLanguage]}
          language={activeLanguage === "react" ? "jsx" : activeLanguage}
        />
      </Card>

      <LightMode>
        <GeneralCta
          title="Explore documentation"
          size="sm"
          fontSize="20px"
          px={8}
          py={8}
          href="https://portal.thirdweb.com/auth"
          w={{ base: "full", md: "inherit" }}
        />
      </LightMode>
    </>
  );
};
