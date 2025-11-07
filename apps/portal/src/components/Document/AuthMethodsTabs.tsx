/* eslint-disable @next/next/no-img-element */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { useMemo, useState } from "react";
import { getSocialIcon } from "thirdweb/wallets/in-app";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DotNetIcon,
  EngineIcon,
  ReactIcon,
  TypeScriptIcon,
  UnityIcon,
  UnrealEngineIcon,
} from "@/icons";
import { cn } from "@/lib/utils";
import { CodeClient } from "../code/code.client";
import { Button } from "../ui/button";

type AuthMethod =
  | "email"
  | "phone"
  | "google"
  | "apple"
  | "facebook"
  | "discord"
  | "x"
  | "telegram"
  | "farcaster"
  | "github"
  | "line"
  | "tiktok"
  | "epic"
  | "passkey"
  | "wallet"
  | "guest"
  | "jwt"
  | "auth_endpoint";

type Platform =
  | "http"
  | "typescript"
  | "react"
  | "react-native"
  | "dotnet"
  | "unity"
  | "unreal";

const authMethods: { id: AuthMethod; label: string; description: string }[] = [
  { id: "email", label: "Email", description: "Email OTP verification" },
  { id: "phone", label: "Phone", description: "SMS OTP verification" },
  { id: "google", label: "Google", description: "Google OAuth" },
  { id: "apple", label: "Apple", description: "Apple OAuth" },
  { id: "facebook", label: "Facebook", description: "Facebook OAuth" },
  { id: "discord", label: "Discord", description: "Discord OAuth" },
  { id: "x", label: "X (Twitter)", description: "X OAuth" },
  { id: "telegram", label: "Telegram", description: "Telegram OAuth" },
  { id: "farcaster", label: "Farcaster", description: "Farcaster OAuth" },
  { id: "github", label: "GitHub", description: "GitHub OAuth" },
  { id: "line", label: "Line", description: "Line OAuth" },
  { id: "tiktok", label: "TikTok", description: "TikTok OAuth" },
  { id: "epic", label: "Epic Games", description: "Epic Games OAuth" },
  { id: "passkey", label: "Passkey", description: "WebAuthn passkey" },
  {
    id: "wallet",
    label: "Wallet",
    description: "External wallet authentication",
  },
  { id: "guest", label: "Guest", description: "Anonymous authentication" },
  { id: "jwt", label: "Custom JWT", description: "Custom JWT authentication" },
  {
    id: "auth_endpoint",
    label: "Custom Auth",
    description: "Custom auth endpoint",
  },
];

const allPlatforms: {
  id: Platform;
  label: string;
  icon: React.ComponentType;
}[] = [
  { id: "http", label: "HTTP", icon: EngineIcon },
  { id: "typescript", label: "TypeScript", icon: TypeScriptIcon },
  { id: "react", label: "React", icon: ReactIcon },
  { id: "react-native", label: "React Native", icon: ReactIcon },
  { id: "dotnet", label: ".NET", icon: DotNetIcon },
  { id: "unity", label: "Unity", icon: UnityIcon },
  { id: "unreal", label: "Unreal Engine", icon: UnrealEngineIcon },
];

// Get platforms based on selected auth method
const getPlatformsForAuth = (authMethod: AuthMethod) => {
  // Only show HTTP tab for email and phone
  if (authMethod === "email" || authMethod === "phone") {
    return allPlatforms;
  }
  // For other auth methods, exclude HTTP
  return allPlatforms.filter((platform) => platform.id !== "http");
};

const getCodeSnippet = (
  authMethod: AuthMethod,
  platform: Platform,
): string[] => {
  switch (platform) {
    case "http":
      return getHTTPSnippet(authMethod);
    case "typescript":
      return [getTypeScriptSnippet(authMethod)];
    case "react":
      return [getReactSnippet(authMethod)];
    case "react-native":
      return [getReactSnippet(authMethod)];
    case "dotnet":
      return [getDotNetSnippet(authMethod)];
    case "unity":
      return [getUnitySnippet(authMethod)];
    case "unreal":
      return [getUnrealSnippet(authMethod)];
    default:
      return [""];
  }
};

const getHTTPSnippet = (authMethod: AuthMethod): string[] => {
  switch (authMethod) {
    case "email":
      return [
        `# Send a login code to the user
POST https://api.thirdweb.com/v1/auth/initiate
Content-Type: application/json
x-client-id: <your-project-client-id>

{
  "type": "email",
  "email": "user@example.com"
}`,
        `# Verify the code and authenticate the user
POST https://api.thirdweb.com/v1/auth/complete
Content-Type: application/json
x-client-id: <your-project-client-id>

{
  "type": "email",
  "email": "user@example.com",
  "code": "123456"
}

// Response includes wallet address and JWT token
// Use the JWT token for subsequent API calls`,
      ];

    case "phone":
      return [
        `# Send a login code to the user
POST https://api.thirdweb.com/v1/auth/initiate
Content-Type: application/json
x-client-id: <your-project-client-id>

{
  "type": "phone",
  "phone": "+1234567890"
}`,
        `# Verify the code and authenticate the user
POST https://api.thirdweb.com/v1/auth/complete
Content-Type: application/json
x-client-id: <your-project-client-id>

{
  "type": "phone",
  "phone": "+1234567890",
  "code": "123456"
}

// Response includes wallet address and JWT token
// Use the JWT token for subsequent API calls`,
      ];

    default:
      return [""];
  }
};

const getTypeScriptSnippet = (authMethod: AuthMethod): string => {
  const baseSetup = `import { createThirdwebClient } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId: "your-client-id" });
const wallet = inAppWallet();

`;

  const baseEnding = `\n\n// Once connected, you can use the account to send transactions
console.log("Connected as:", account?.address);`;

  switch (authMethod) {
    case "email":
      return (
        baseSetup +
        `// Email authentication
import { preAuthenticate } from "thirdweb/wallets/in-app";

// Send OTP
await preAuthenticate({
  client,
  strategy: "email",
  email: "user@example.com",
});

// Connect with verification code
const account = await wallet.connect({
  client,
  strategy: "email",
  email: "user@example.com",
  verificationCode: "123456",
});` +
        baseEnding
      );

    case "phone":
      return (
        baseSetup +
        `// Phone authentication
import { preAuthenticate } from "thirdweb/wallets/in-app";

// Send OTP
await preAuthenticate({
  client,
  strategy: "phone",
  phoneNumber: "+1234567890",
});

// Connect with verification code
const account = await wallet.connect({
  client,
  strategy: "phone",
  phoneNumber: "+1234567890",
  verificationCode: "123456",
});` +
        baseEnding
      );

    case "google":
    case "apple":
    case "facebook":
    case "discord":
    case "x":
    case "telegram":
    case "farcaster":
    case "github":
    case "line":
    case "tiktok":
    case "epic":
      return (
        baseSetup +
        `// ${authMethod.charAt(0).toUpperCase() + authMethod.slice(1)} OAuth
const account = await wallet.connect({
  client,
  strategy: "${authMethod}",
});` +
        baseEnding
      );

    case "passkey":
      return (
        baseSetup +
        `// Passkey authentication
import { hasStoredPasskey } from "thirdweb/wallets/in-app";

const hasPasskey = await hasStoredPasskey(client);
const account = await wallet.connect({
  client,
  strategy: "passkey",
  type: hasPasskey ? "sign-in" : "sign-up",
});` +
        baseEnding
      );

    case "wallet":
      return (
        baseSetup +
        `// External wallet authentication
import { createWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";

const account = await wallet.connect({
  client,
  strategy: "wallet",
  wallet: createWallet("io.metamask"),
  chain: sepolia,
});` +
        baseEnding
      );

    case "guest":
      return (
        baseSetup +
        `// Guest authentication
const account = await wallet.connect({
  client,
  strategy: "guest",
});` +
        baseEnding
      );

    case "jwt":
      return (
        baseSetup +
        `// Custom JWT authentication
const account = await wallet.connect({
  client,
  strategy: "jwt",
  jwt: "your-jwt-token",
});` +
        baseEnding
      );

    case "auth_endpoint":
      return (
        baseSetup +
        `// Custom auth endpoint
const account = await wallet.connect({
  client,
  strategy: "auth_endpoint",
  payload: "your-auth-payload",
});` +
        baseEnding
      );

    default:
      return baseSetup + baseEnding;
  }
};

const getReactSnippet = (authMethod: AuthMethod): string => {
  const baseSetup = `import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, useConnect, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

const client = createThirdwebClient({ clientId: "your-client-id" });
const wallet = inAppWallet();

// 1. Wrap your app with ThirdwebProvider
function App() {
  return (
    <ThirdwebProvider>
      <MyComponent />
    </ThirdwebProvider>
  );
}

// 2. Custom hook approach
function MyComponent() {
  const { connect } = useConnect();
  // Once connected, you can access the active account
  const activeAccount = useActiveAccount();
  console.log("Connected as:", activeAccount?.address);

  const handleLogin = async () => {
    await connect(async () => {
`;

  const baseEnding = `      return wallet;
    });
  };

  return (
    <button onClick={handleLogin}>
      Connect
    </button>
  );
}

// 3. Or use prebuilt UI components (ConnectButton/ConnectEmbed)
function PrebuiltUIExample() {
  const walletWithAuth = inAppWallet({
    auth: { options: ["${authMethod}"] },
    metadata: {
      name: "My App",
      icon: "https://example.com/icon.png",
      image: {
        src: "https://example.com/logo.png",
        alt: "My logo",
        width: 100,
        height: 100,
      },
    },
  });

  return (
      <ConnectButton
        client={client}
        wallets={[walletWithAuth]}
      />
  );
}`;

  // Specialised snippets for email and phone where OTP sending is a separate step
  if (authMethod === "email") {
    return `import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, useConnect, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { preAuthenticate } from "thirdweb/wallets/in-app";

const client = createThirdwebClient({ clientId: "your-client-id" });
const wallet = inAppWallet();

// 1. Wrap your app with ThirdwebProvider
function App() {
  return (
    <ThirdwebProvider>
      <MyComponent />
    </ThirdwebProvider>
  );
}

// 2. Custom hook approach
function MyComponent() {
  const { connect } = useConnect();

  // Once connected, you can access the active account
  const activeAccount = useActiveAccount();
  console.log("Connected as:", activeAccount?.address);

  const sendOtp = async (email: string) => {
    // send email verification code
    await preAuthenticate({
      client,
      strategy: "email",
      email, // ex: user@example.com
    });
  };

  const handleLogin = async (email: string, verificationCode: string) => {
    // verify email and connect
    await connect(async () => {
      await wallet.connect({
        client,
        strategy: "email",
        email,
        verificationCode,
      });
      return wallet;
    });
  };

  return (
    <>
      <button onClick={() => sendOtp("user@example.com")}>Send OTP</button>
      <button onClick={() => handleLogin("user@example.com", "123456")}>Connect</button>
    </>
  );
}

// 3. Or use prebuilt UI components (ConnectButton/ConnectEmbed)
const walletWithAuth = inAppWallet({
    auth: { options: ["email"] },
    metadata: {
        name: "My App",
        icon: "https://example.com/icon.png",
        image: {
        src: "https://example.com/logo.png",
        alt: "My logo",
        width: 100,
        height: 100,
        },
    },
});

function PrebuiltUIExample() {
  // Once connected, you can access the active account
  const activeAccount = useActiveAccount();
  console.log("Connected as:", activeAccount?.address);

  return (
      <ConnectButton
        client={client}
        wallets={[walletWithAuth]}
      />
  );
}`;
  }

  if (authMethod === "phone") {
    return `import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { preAuthenticate } from "thirdweb/wallets/in-app";

const client = createThirdwebClient({ clientId: "your-client-id" });
const wallet = inAppWallet();

// 1. Wrap your app with ThirdwebProvider
function App() {
  return (
    <ThirdwebProvider>
      <MyComponent />
    </ThirdwebProvider>
  );
}

// 2. Custom hook approach
function MyComponent() {
  const { connect } = useConnect();

  const sendOtp = async (phoneNumber: string) => {
    // send SMS verification code
    await preAuthenticate({
      client,
      strategy: "phone",
      phoneNumber, // ex: +1234567890
    });
  };

  const handleLogin = async (phoneNumber: string, verificationCode: string) => {
    // verify phone number and connect
    await connect(async () => {
      await wallet.connect({
        client,
        strategy: "phone",
        phoneNumber,
        verificationCode,
      });
      return wallet;
    });
  };

  return (
    <>
      <button onClick={() => sendOtp("+1234567890")}>Send OTP</button>
      <button onClick={() => handleLogin("+1234567890", "123456")}>Connect</button>
    </>
  );
}

// 3. Or use prebuilt UI components (ConnectButton/ConnectEmbed)
function PrebuiltUIExample() {
  const walletWithAuth = inAppWallet({
    auth: { options: ["phone"] },
    metadata: {
      name: "My App",
      icon: "https://example.com/icon.png",
      image: {
        src: "https://example.com/logo.png",
        alt: "My logo",
        width: 100,
        height: 100,
      },
    },
  });

  return (
      <ConnectButton
        client={client}
        wallets={[walletWithAuth]}
      />
  );
}`;
  }

  // All other auth methods follow the previous pattern
  switch (authMethod) {
    case "google":
    case "apple":
    case "facebook":
    case "discord":
    case "x":
    case "telegram":
    case "farcaster":
    case "github":
    case "line":
    case "tiktok":
    case "epic":
      return (
        baseSetup +
        `      await wallet.connect({\n        client,\n        strategy: "${authMethod}",\n      });\n` +
        baseEnding
      );

    case "passkey":
      return (
        baseSetup +
        `      const hasPasskey = await hasStoredPasskey(client);\n      await wallet.connect({\n        client,\n        strategy: "passkey",\n        type: hasPasskey ? "sign-in" : "sign-up",\n      });\n` +
        baseEnding
      );

    case "wallet":
      return (
        baseSetup +
        `      await wallet.connect({\n        client,\n        strategy: "wallet",\n        wallet: createWallet("io.metamask"),\n        chain: sepolia,\n      });\n` +
        baseEnding
      );

    case "guest":
      return (
        baseSetup +
        `      await wallet.connect({\n        client,\n        strategy: "guest",\n      });\n` +
        baseEnding
      );

    case "jwt":
      return (
        baseSetup +
        `      await wallet.connect({\n        client,\n        strategy: "jwt",\n        jwt: "your-jwt-token",\n      });\n` +
        baseEnding
      );

    case "auth_endpoint":
      return (
        baseSetup +
        `      await wallet.connect({\n        client,\n        strategy: "auth_endpoint",\n        payload: "your-auth-payload",\n      });\n` +
        baseEnding
      );

    default:
      return baseSetup + baseEnding;
  }
};

const getDotNetSnippet = (authMethod: AuthMethod): string => {
  const baseSetup = `using Thirdweb;

var client = ThirdwebClient.Create(clientId: "your-client-id");
`;

  switch (authMethod) {
    case "email":
      return (
        baseSetup +
        `// Email authentication
var wallet = await InAppWallet.Create(client: client, email: "user@example.com");
await wallet.SendOTP();
var address = await wallet.LoginWithOtp("123456");`
      );

    case "phone":
      return (
        baseSetup +
        `// Phone authentication
var wallet = await InAppWallet.Create(client: client, phoneNumber: "+1234567890");
await wallet.SendOTP();
var address = await wallet.LoginWithOtp("123456");`
      );

    case "google":
    case "apple":
    case "facebook":
    case "discord":
    case "x":
    case "telegram":
    case "farcaster":
    case "github":
    case "line":
    case "tiktok":
    case "epic": {
      const providerMap: Record<string, string> = {
        google: "Google",
        apple: "Apple",
        facebook: "Facebook",
        discord: "Discord",
        x: "X",
        telegram: "Telegram",
        farcaster: "Farcaster",
        github: "Github",
        line: "Line",
        tiktok: "TikTok",
        epic: "Epic",
      };
      return (
        baseSetup +
        `// ${providerMap[authMethod]} OAuth
var wallet = await InAppWallet.Create(client: client, authProvider: AuthProvider.${providerMap[authMethod]});
var address = await wallet.LoginWithOauth(
  isMobile: false,
  browserOpenAction: (url) => {
    var psi = new ProcessStartInfo { FileName = url, UseShellExecute = true };
    _ = Process.Start(psi);
  },
  mobileRedirectScheme: "myapp://"
);`
      );
    }

    case "guest":
      return (
        baseSetup +
        `// Guest authentication
var wallet = await InAppWallet.Create(client: client, authProvider: AuthProvider.Guest);
var address = await wallet.LoginWithGuest();`
      );

    case "jwt":
      return (
        baseSetup +
        `// Custom JWT authentication
var wallet = await InAppWallet.Create(client: client, authProvider: AuthProvider.JWT);
var address = await wallet.LoginWithCustomAuth(jwt: "your-jwt-token");`
      );

    case "auth_endpoint":
      return (
        baseSetup +
        `// Custom auth endpoint
var wallet = await InAppWallet.Create(client: client, authProvider: AuthProvider.AuthEndpoint);
var address = await wallet.LoginWithAuthEndpoint(payload: "your-auth-payload");`
      );

    case "wallet":
      return (
        baseSetup +
        `// External wallet authentication
var externalWallet = await PrivateKeyWallet.Create(client, "your-private-key");
var wallet = await InAppWallet.Create(client: client, authProvider: AuthProvider.Siwe, siweSigner: externalWallet);
var address = await wallet.LoginWithSiwe(chainId: 1);`
      );

    default:
      return (
        baseSetup +
        `// ${authMethod} authentication
var wallet = await InAppWallet.Create(client: client);`
      );
  }
};

const getUnitySnippet = (authMethod: AuthMethod): string => {
  const baseSetup = `using Thirdweb;

`;

  switch (authMethod) {
    case "email":
      return (
        baseSetup +
        `// Email authentication
var inAppWalletOptions = new InAppWalletOptions(email: "user@example.com");
var options = new WalletOptions(
    provider: WalletProvider.InAppWallet,
    chainId: 1,
    inAppWalletOptions: inAppWalletOptions
);
var wallet = await ThirdwebManager.Instance.ConnectWallet(options);`
      );

    case "phone":
      return (
        baseSetup +
        `// Phone authentication
var inAppWalletOptions = new InAppWalletOptions(phoneNumber: "+1234567890");
var options = new WalletOptions(
    provider: WalletProvider.InAppWallet,
    chainId: 1,
    inAppWalletOptions: inAppWalletOptions
);
var wallet = await ThirdwebManager.Instance.ConnectWallet(options);`
      );

    case "google":
    case "apple":
    case "facebook":
    case "discord":
    case "x":
    case "telegram":
    case "farcaster":
    case "github":
    case "line":
    case "tiktok":
    case "epic": {
      const providerMap: Record<string, string> = {
        google: "Google",
        apple: "Apple",
        facebook: "Facebook",
        discord: "Discord",
        x: "X",
        telegram: "Telegram",
        farcaster: "Farcaster",
        github: "Github",
        line: "Line",
        tiktok: "TikTok",
        epic: "Epic",
      };
      return (
        baseSetup +
        `// ${providerMap[authMethod]} OAuth
var inAppWalletOptions = new InAppWalletOptions(authprovider: AuthProvider.${providerMap[authMethod]});
var options = new WalletOptions(
    provider: WalletProvider.InAppWallet,
    chainId: 1,
    inAppWalletOptions: inAppWalletOptions
);
var wallet = await ThirdwebManager.Instance.ConnectWallet(options);`
      );
    }

    case "guest":
      return (
        baseSetup +
        `// Guest authentication
var inAppWalletOptions = new InAppWalletOptions(authprovider: AuthProvider.Guest);
var options = new WalletOptions(
    provider: WalletProvider.InAppWallet,
    chainId: 1,
    inAppWalletOptions: inAppWalletOptions
);
var wallet = await ThirdwebManager.Instance.ConnectWallet(options);`
      );

    case "wallet":
      return (
        baseSetup +
        `// External wallet authentication
var externalWallet = await PrivateKeyWallet.Create(client, "your-private-key");
var inAppWalletOptions = new InAppWalletOptions(authprovider: AuthProvider.Siwe, siweSigner: externalWallet);
var options = new WalletOptions(
    provider: WalletProvider.InAppWallet,
    chainId: 1,
    inAppWalletOptions: inAppWalletOptions
);
var wallet = await ThirdwebManager.Instance.ConnectWallet(options);`
      );

    default:
      return (
        baseSetup +
        `// ${authMethod} authentication
var inAppWalletOptions = new InAppWalletOptions();
var options = new WalletOptions(
    provider: WalletProvider.InAppWallet,
    chainId: 1,
    inAppWalletOptions: inAppWalletOptions
);
var wallet = await ThirdwebManager.Instance.ConnectWallet(options);`
      );
  }
};

const getUnrealSnippet = (authMethod: AuthMethod): string => {
  return `// ${authMethod.charAt(0).toUpperCase() + authMethod.slice(1)} authentication in Unreal Engine
// Use the Blueprint nodes for ${authMethod} authentication
// See the Unreal Engine documentation for specific Blueprint setup`;
};

function AuthMethodsTabsContent() {
  const [selectedAuth, setSelectedAuth] = useState<AuthMethod>("email");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const platforms = useMemo(
    () => getPlatformsForAuth(selectedAuth),
    [selectedAuth],
  );

  // Reset platform selection when platforms change
  const currentPlatform = useMemo(() => {
    const defaultPlatform = platforms[0]?.id || "typescript";
    // If currently selected platform is not available in new platforms, reset to first available
    if (
      !selectedPlatform ||
      !platforms.find((p) => p.id === selectedPlatform)
    ) {
      return defaultPlatform;
    }
    return selectedPlatform;
  }, [platforms, selectedPlatform]);

  return (
    <div className="space-y-6">
      {/* Auth Method Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          1. Choose Authentication Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {authMethods.map((method) => (
            <Button
              type="button"
              variant="outline"
              key={method.id}
              onClick={() => setSelectedAuth(method.id)}
              className={cn(
                "overflow-hidden text-ellipsis text-sm rounded-lg hover:bg-accent justify-start gap-3 h-auto py-3 rounded-xl",
                selectedAuth === method.id &&
                  "font-medium text-foreground bg-accent",
              )}
            >
              <img
                alt={method.label}
                className="size-5 shrink-0"
                src={getSocialIcon(method.id)}
              />
              <div>{method.label}</div>
            </Button>
          ))}
        </div>
      </div>

      {/* Platform Tabs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">
          2. Select Platform
        </h3>
        <Tabs
          value={currentPlatform}
          onValueChange={(value) => setSelectedPlatform(value as Platform)}
        >
          <TabsList>
            {platforms.map((platform) => {
              return (
                <TabsTrigger key={platform.id} value={platform.id}>
                  {platform.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <TabsContent
                key={platform.id}
                value={platform.id}
                className="mt-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center">
                      <IconComponent />
                    </span>
                    <h4 className="font-medium">
                      {authMethods.find((m) => m.id === selectedAuth)?.label}{" "}
                      authentication with {platform.label}
                    </h4>
                  </div>
                  <div className="relative space-y-4">
                    {getCodeSnippet(selectedAuth, platform.id).map(
                      (code, i) => (
                        <CodeClient
                          key={`${platform.id}-${i}`}
                          code={code}
                          lang={
                            platform.id === "http"
                              ? "http"
                              : platform.id === "dotnet" ||
                                  platform.id === "unity"
                                ? "csharp"
                                : "typescript"
                          }
                          className="text-sm"
                        />
                      ),
                    )}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

export function AuthMethodsTabs() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthMethodsTabsContent />
    </QueryClientProvider>
  );
}
